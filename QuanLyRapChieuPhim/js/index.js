const loginUrl = "./login.html";
const logoutCssUrl = "./logout.css";

const moviesKey = "rikkei_movies";
const subscribeKey = "rikkei_subscribers";
const selectedMovieKey = "rikkei_selected_movie";
let hotCountdownTimer = null;

// Tạo danh sách suất chiếu giả lập cho 14 ngày tới (dùng để chạy countdown phim hot)
function buildShowOptionsForMovie(movieId) {
  const showTimes = ["10:00", "14:00", "19:30"];
  const result = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const strDate = `${year}-${month}-${day}`;

    for (let i = 0; i < showTimes.length; i += 1) {
      const time = showTimes[i];
      const dt = new Date(`${strDate}T${time}:00`);
      if (dt.getTime() >= Date.now() - 60000) {
        result.push({ movieId, showDate: strDate, showTime: time, dateTime: dt });
      }
    }
  }

  return result;
}

// Lấy suất chiếu sắp tới gần nhất
function getNearestShow(showList) {
  let nearest = null;
  for (let i = 0; i < showList.length; i += 1) {
    const item = showList[i];
    if (!nearest || item.dateTime.getTime() < nearest.dateTime.getTime()) {
      nearest = item;
    }
  }
  return nearest;
}

// Hiển thị countdown cho phim hot ngay ở hero
function startHotCountdown(movieId) {
  const box = document.getElementById("hotCountdown");
  const valueEl = document.getElementById("hotCountdownValue");
  if (!box || !valueEl) return;

  if (hotCountdownTimer) {
    clearInterval(hotCountdownTimer);
    hotCountdownTimer = null;
  }

  const showList = buildShowOptionsForMovie(movieId);
  const nextShow = getNearestShow(showList);
  if (!nextShow) {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  const target = nextShow.dateTime;

  const tick = () => {
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) {
      valueEl.textContent = "00:00:00";
      return;
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    valueEl.textContent = `${hours}:${minutes}:${seconds}`;
  };

  tick();
  hotCountdownTimer = setInterval(tick, 1000);
}

function showToast(title, message, type) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const safeType = type === "success" || type === "warning" || type === "error" || type === "info" ? type : "info";
  const safeTitle = String(title || "");
  const safeMsg = String(message || "");

  while (container.children.length >= 4) {
    container.removeChild(container.firstChild);
  }

  const el = document.createElement("div");
  el.className = `toast ${safeType}`;
  el.innerHTML = `
    <div class="toast-icon" aria-hidden="true"></div>
    <div>
      <div class="toast-title">${safeTitle || (safeType === "success" ? "Thành công" : safeType === "warning" ? "Lưu ý" : safeType === "error" ? "Lỗi" : "Thông báo")}</div>
      <div class="toast-msg">${safeMsg}</div>
    </div>
  `;
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.add("show");
  });

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 260);
  }, 2400);
}

// Hiển thị lỗi màu đỏ dưới ô email đăng ký
function setSubscribeError(message) {
  const errorEl = document.getElementById("subscribeError");
  if (!errorEl) return;
  errorEl.textContent = message || "";
}

// Lấy thông tin user đang đăng nhập
function getCurrentUser() {
  const rawUser = localStorage.getItem("currentUser");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
}

// Lấy danh sách phim từ localStorage
function getMovieList() {
  const rawMovies = localStorage.getItem(moviesKey);
  if (!rawMovies) return [];

  try {
    const parsedMovies = JSON.parse(rawMovies);
    return Array.isArray(parsedMovies) ? parsedMovies : [];
  } catch (error) {
    return [];
  }
}

// Cắt mô tả cho gọn
function shortText(text, maxLen) {
  const cleanText = String(text || "").trim();
  if (cleanText.length <= maxLen) return cleanText;
  return `${cleanText.slice(0, maxLen).trim()}...`;
}

// Tách thể loại (genre) hiển thị gọn
function normalizeGenre(genreText) {
  const cleanGenre = String(genreText || "").trim();
  if (!cleanGenre) return "Khác";
  return cleanGenre
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}

// Tạo link YouTube embed (hỗ trợ youtu.be / watch?v= / embed)
function toYoutubeEmbedUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return "";

  const isEmbed = rawUrl.includes("youtube.com/embed/");
  if (isEmbed) return rawUrl;

  const shortMatch = rawUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const watchMatch = rawUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return rawUrl;
}

// Mở modal trailer
function openTrailerModal(movie) {
  const overlay = document.getElementById("trailerOverlay");
  const closeBtn = document.getElementById("trailerClose");
  const titleEl = document.getElementById("trailerTitle");
  const bodyEl = document.getElementById("trailerBody");

  if (!overlay || !closeBtn || !titleEl || !bodyEl) return;

  const movieName = movie?.name ? String(movie.name) : "Trailer";
  titleEl.textContent = `Trailer - ${movieName}`;

  const trailerUrl = toYoutubeEmbedUrl(movie?.trailerUrl || movie?.trailer || "");
  if (!trailerUrl) {
    bodyEl.innerHTML = `<div class="trailer-empty">Phim này chưa có link trailer trong dữ liệu.</div>`;
  } else {
    bodyEl.innerHTML = `
      <iframe
        class="trailer-iframe"
        src="${trailerUrl}"
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  }

  const close = () => {
    overlay.style.display = "none";
    bodyEl.innerHTML = "";
  };

  overlay.style.display = "flex";
  closeBtn.onclick = close;
  overlay.onclick = (event) => {
    if (event.target === overlay) close();
  };
  document.onkeydown = (event) => {
    if (event.key === "Escape") close();
  };
}

// Đăng ký email nhận ưu đãi
function subscribeEmail() {
  const emailInput = document.getElementById("subscribeEmail");
  if (!emailInput) return;

  const emailValue = String(emailInput.value || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValue) {
    setSubscribeError("Vui lòng nhập email.");
    return;
  }
  if (!emailPattern.test(emailValue)) {
    setSubscribeError("Email không hợp lệ.");
    return;
  }

  const rawList = localStorage.getItem(subscribeKey);
  let emailList = [];
  try {
    emailList = rawList ? JSON.parse(rawList) : [];
    if (!Array.isArray(emailList)) emailList = [];
  } catch (error) {
    emailList = [];
  }

  const exists = emailList.some((item) => String(item || "").toLowerCase() === emailValue.toLowerCase());
  if (exists) {
    setSubscribeError("Email này đã được đăng ký.");
    return;
  }

  emailList.push(emailValue);
  localStorage.setItem(subscribeKey, JSON.stringify(emailList));
  emailInput.value = "";
  setSubscribeError("");
  showToast("Đăng ký thành công", "Bạn sẽ nhận ưu đãi qua email.", "success");
}

// Điều hướng mua vé: chưa đăng nhập -> login, có đăng nhập -> lưu phim đã chọn
function handleBuyTicket(movie) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    localStorage.setItem(selectedMovieKey, JSON.stringify({ movieId: movie?.id || null, createdAt: new Date().toISOString() }));
    window.location.href = loginUrl;
    return;
  }

  localStorage.setItem(selectedMovieKey, JSON.stringify({ movieId: movie?.id || null, createdAt: new Date().toISOString() }));
  showToast("Đặt vé", "Chức năng đặt vé sẽ phát triển sau", "info");
}

// Render 4 phim đang chiếu
function renderShowingMovies(movieList) {
  const listBox = document.getElementById("showingMovieList");
  if (!listBox) return;

  const showingMovies = movieList.filter((movie) => movie.status === "Đang chiếu");
  const renderList = showingMovies.slice(0, 4);

  if (renderList.length === 0) {
    listBox.innerHTML = `<div style="color:#9CA3AF;">Chưa có phim đang chiếu.</div>`;
    return;
  }

  listBox.innerHTML = renderList
    .map((movie) => {
      const genreText = normalizeGenre(movie.genre);
      const durationText = Number(movie.duration) ? `${movie.duration} phút` : "N/A";
      return `
        <div class="one-block-movie">
          <img src="${movie.poster}" alt="${movie.name}" onerror="this.src='https://via.placeholder.com/260x390?text=Poster'">
          <div class="content-block-movie">
            <div class="title-movie">${movie.name}</div>
            <div class="content-movie"><i class="fa-regular fa-clock"></i>${durationText} &bull; ${genreText}</div>
            <button class="button-movie" type="button" data-buy-id="${movie.id}">Mua vé</button>
          </div>
        </div>
      `;
    })
    .join("");

  const buyButtons = listBox.querySelectorAll("[data-buy-id]");
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = Number(button.getAttribute("data-buy-id"));
      const selectedMovie = movieList.find((movie) => Number(movie.id) === movieId);
      handleBuyTicket(selectedMovie);
    });
  });
}

// Hiển thị phim nổi bật (chỉ 1 phim, ưu tiên phim đang chiếu)
function initHotCarousel(movieList) {
  const titleEl = document.getElementById("hotMovieTitle");
  const descEl = document.getElementById("hotMovieDesc");
  const tagEl = document.getElementById("hotTagText");
  const btnBuy = document.getElementById("btnBuyHot");
  const btnTrailer = document.getElementById("btnTrailerHot");
  const heroBackground = document.getElementById("heroBackground");
  const carouselBox = document.getElementById("heroCarousel");
  const dotsBox = document.getElementById("heroDots");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");

  if (!titleEl || !descEl || !btnBuy || !btnTrailer || !tagEl || !heroBackground || !carouselBox || !dotsBox || !prevBtn || !nextBtn) {
    return;
  }

  const showingMovies = movieList.filter((movie) => movie.status === "Đang chiếu");
  const hotMovies = showingMovies
    .slice()
    .sort((a, b) => String(b.releaseDate || "").localeCompare(String(a.releaseDate || "")))
    .slice(0, 3);

  const fallbackMovie = movieList[0] || null;
  const carouselMovies = hotMovies.length > 0 ? hotMovies : (fallbackMovie ? [fallbackMovie] : []);

  if (carouselMovies.length === 0) {
    titleEl.textContent = "Chưa có dữ liệu phim";
    descEl.textContent = "Vui lòng vào trang admin để thêm phim.";
    tagEl.textContent = "Chưa có phim";
    return;
  }

  let currentIndex = 0;

  const renderHero = () => {
    const movie = carouselMovies[currentIndex];

    tagEl.textContent = "Đang Thịnh Hành";
    titleEl.innerHTML = String(movie.name || "").replace(": ", ":<br>");
    descEl.textContent = shortText(movie.desc || "", 180);

    btnBuy.onclick = () => handleBuyTicket(movie);
    btnTrailer.onclick = () => openTrailerModal(movie);

    const posterUrl = String(movie.poster || "").trim();
    heroBackground.style.backgroundImage = posterUrl
      ? `url("${posterUrl}")`
      : `url("../assets/images/BackgroundIndex.png")`;

    // Countdown cho phim hot (không hiển thị suất chiếu)
    startHotCountdown(movie.id);

    dotsBox.innerHTML = carouselMovies
      .map((_, idx) => `<button class="hero-dot ${idx === currentIndex ? "active" : ""}" type="button" data-dot="${idx}"></button>`)
      .join("");

    dotsBox.querySelectorAll("[data-dot]").forEach((dotBtn) => {
      dotBtn.addEventListener("click", () => {
        const nextIndex = Number(dotBtn.getAttribute("data-dot"));
        if (!Number.isNaN(nextIndex)) {
          currentIndex = nextIndex;
          renderHero();
          // đề không yêu cầu auto đổi hero, nên chỉ đổi khi user bấm
        }
      });
    });
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % carouselMovies.length;
    renderHero();
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + carouselMovies.length) % carouselMovies.length;
    renderHero();
  };

  prevBtn.onclick = () => {
    prev();
  };
  nextBtn.onclick = () => {
    next();
  };

  carouselBox.style.display = carouselMovies.length > 1 ? "flex" : "none";
  renderHero();
}

// Hiển thị nút đăng nhập/đăng xuất
function initAuthButton() {
  const authBtn = document.getElementById("authButton");
  const authLink = document.getElementById("authLink");
  if (!authBtn || !authLink) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    authBtn.textContent = "Đăng nhập";
    authLink.href = loginUrl;
    return;
  }

  authBtn.textContent = "Đăng xuất";
  authLink.href = "#";
  authBtn.onclick = (event) => {
    event.preventDefault();
    showLogoutModal();
  };
}

// Hiện modal xác nhận đăng xuất
function showLogoutModal() {
  if (document.getElementById("logout-overlay")) return;

  if (!document.querySelector(`link[href="${logoutCssUrl}"]`)) {
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = logoutCssUrl;
    document.head.appendChild(linkEl);
  }

  const overlay = document.createElement("div");
  overlay.id = "logout-overlay";
  overlay.className = "logout-overlay";
  overlay.innerHTML = `
    <div class="logout-modal">
      <h3 class="logout-title">Xác nhận đăng xuất</h3>
      <p class="logout-message">Bạn có chắc chắn muốn đăng xuất không?</p>
      <div class="logout-actions">
        <button id="cancelLogout" class="logout-btn cancel-btn">Hủy</button>
        <button id="okLogout" class="logout-btn ok-btn">OK</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  const cancelBtn = document.getElementById("cancelLogout");
  const okBtn = document.getElementById("okLogout");

  if (cancelBtn) cancelBtn.onclick = close;
  if (okBtn) {
    okBtn.onclick = () => {
      localStorage.removeItem("currentUser");
      window.location.href = loginUrl;
    };
  }
  overlay.onclick = (event) => {
    if (event.target === overlay) close();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.ensureSeedMovies === "function") {
    window.ensureSeedMovies();
  }

  initAuthButton();

  const movieList = getMovieList();
  initHotCarousel(movieList);
  renderShowingMovies(movieList);

  const subscribeBtn = document.getElementById("btnSubscribe");
  if (subscribeBtn) subscribeBtn.addEventListener("click", subscribeEmail);

  const subscribeInput = document.getElementById("subscribeEmail");
  if (subscribeInput) {
    subscribeInput.addEventListener("input", () => {
      setSubscribeError("");
    });
  }
});

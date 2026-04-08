(function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || (currentUser.role !== "admin" && currentUser.email !== "admin@rikkei.edu.vn")) {
    // Thử dùng đường dẫn đơn giản nhất nếu 2 file ở cùng thư mục pages
    window.location.replace("../pages/login.html");
  }
})();

const KEY = "rikkei_movies";
let movies = JSON.parse(localStorage.getItem(KEY)) || [];
let currentPage = 1;
let perPage = 5;
let currentFilter = "all";
let currentSearch = "";
let editingId = null;
let deleteMovieId = null;

// =========================================================
// ================ PHẦN 1: QUẢN LÝ PHIM ===================
// =========================================================
// -------- CHỨC NĂNG HIỂN THỊ & TÌM KIẾM PHIM --------

if (movies.length === 0) {
  movies = [
    {
      id: 1,
      name: "Dune: Part Two",
      genre: "Khoa học viễn tưởng",
      duration: 166,
      releaseDate: "2026-04-09",
      status: "Đang chiếu",
      price: 90000,
      poster: "../assets/images/Dune Poster.png",
      desc: "Hành trình sử thi tiếp diễn",
    },
    {
      id: 2,
      name: "Kung Fu Panda 4",
      genre: "Hoạt hình",
      duration: 94,
      releaseDate: "2026-04-06",
      status: "Đang chiếu",
      price: 75000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Po trở lại",
    },
    {
      id: 3,
      name: "Godzilla x Kong",
      genre: "Hành động",
      duration: 115,
      releaseDate: "2026-04-07",
      status: "Đã chiếu",
      price: 95000,
      poster: "../assets/images/Godzilla Poster.png",
      desc: "Cuộc chiến của hai quái vật",
    },
    {
      id: 4,
      name: "Mai",
      genre: "Tình cảm",
      duration: 131,
      releaseDate: "2026-04-08",
      status: "Sắp chiếu",
      price: 80000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Tình yêu tuyệt vời",
    },
    {
      id: 5,
      name: "Exhuma",
      genre: "Kinh dị",
      duration: 134,
      releaseDate: "2026-04-10",
      status: "Đang chiếu",
      price: 85000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Bí mật bị chôn dưới lòng đất",
    },
    {
      id: 6,
      name: "Super Mario Thiên Hà",
      genre: "Hoạt hình",
      duration: 92,
      releaseDate: "2026-04-09",
      status: "Đang chiếu",
      price: 75000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Mario phiêu lưu trong thiên hà",
    },
    {
      id: 7,
      name: "Thunderbolts",
      genre: "Siêu anh hùng",
      duration: 140,
      releaseDate: "2026-04-11",
      status: "Đang chiếu",
      price: 115000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Biệt đội phản anh hùng thực hiện nhiệm vụ nguy hiểm.",
    },
    {
      id: 8,
      name: "Snow White",
      genre: "Gia đình",
      duration: 120,
      releaseDate: "2026-04-12",
      status: "Đang chiếu",
      price: 90000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Phiên bản live-action của nàng Bạch Tuyết.",
    },
    {
      id: 9,
      name: "Minecraft",
      genre: "Phiêu lưu",
      duration: 110,
      releaseDate: "2026-04-13",
      status: "Đang chiếu",
      price: 95000,
      poster: "../assets/images/Godzilla Poster.png",
      desc: "Thế giới Minecraft bước lên màn ảnh rộng.",
    },
    {
      id: 10,
      name: "Doraemon: Nobita's Earth Symphony",
      genre: "Hoạt hình",
      duration: 115,
      releaseDate: "2026-04-09",
      status: "Đang chiếu",
      price: 75000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Doraemon và Nobita trong chuyến phiêu lưu âm nhạc.",
    },
    {
      id: 11,
      name: "Detective Conan: The Million-dollar Pentagram",
      genre: "Trinh thám",
      duration: 110,
      releaseDate: "2026-04-15",
      status: "Đang chiếu",
      price: 80000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Vụ án mới liên quan đến kho báu bí ẩn.",
    },
    {
      id: 12,
      name: "The First Omen",
      genre: "Kinh dị",
      duration: 119,
      releaseDate: "2026-04-05",
      status: "Đang chiếu",
      price: 85000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Nguồn gốc thế lực tà ác được hé lộ.",
    },
    {
      id: 13,
      name: "Civil War",
      genre: "Hành động",
      duration: 109,
      releaseDate: "2026-04-06",
      status: "Sắp chiếu",
      price: 90000,
      poster: "../assets/images/Godzilla Poster.png",
      desc: "Nước Mỹ rơi vào nội chiến trong tương lai.",
    },
    {
      id: 14,
      name: "Abigail",
      genre: "Kinh dị",
      duration: 109,
      releaseDate: "2026-04-07",
      status: "Đang chiếu",
      price: 85000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Con tin hóa ra là thứ đáng sợ hơn.",
    },
    {
      id: 15,
      name: "The Fall Guy",
      genre: "Hành động",
      duration: 126,
      releaseDate: "2026-04-08",
      status: "Đang chiếu",
      price: 95000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Cascadeur bị cuốn vào âm mưu nguy hiểm.",
    },
    {
      id: 16,
      name: "Michael",
      genre: "Tiểu sử",
      duration: 138,
      releaseDate: "2026-04-09",
      status: "Sắp chiếu",
      price: 100000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Cuộc đời của Michael Jackson",
    },
    {
      id: 17,
      name: "Đại Tiệc Trăng Máu 8",
      genre: "Hài",
      duration: 110,
      releaseDate: "2026-04-10",
      status: "Sắp chiếu",
      price: 85000,
      poster: "../assets/images/Godzilla Poster.png",
      desc: "Tiệc tối lạnh người",
    },
    {
      id: 18,
      name: "Heo Năm Móng",
      genre: "Kinh dị",
      duration: 105,
      releaseDate: "2026-04-11",
      status: "Sắp chiếu",
      price: 80000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Bí ẩn trong rừng sâu",
    },
    {
      id: 19,
      name: "Toy Story 5",
      genre: "Hoạt hình",
      duration: 95,
      releaseDate: "2026-04-12",
      status: "Sắp chiếu",
      price: 80000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Cuộc phiêu lưu tiếp tục của đồ chơi",
    },
    {
      id: 20,
      name: "Moana 2",
      genre: "Hoạt hình",
      duration: 114,
      releaseDate: "2026-04-13",
      status: "Sắp chiếu",
      price: 75000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Hành trình trên biển tiếp tục",
    },
    {
      id: 21,
      name: "Frozen 3 - Nữ Hoàng Băng Giá 3",
      genre: "Hoạt hình",
      duration: 120,
      releaseDate: "2026-04-14",
      status: "Sắp chiếu",
      price: 80000,
      poster: "../assets/images/Godzilla Poster.png",
      desc: "Elsa và Anna trở lại",
    },
    {
      id: 22,
      name: "Avatar 4",
      genre: "Khoa học viễn tưởng",
      duration: 185,
      releaseDate: "2026-04-15",
      status: "Sắp chiếu",
      price: 130000,
      poster: "../assets/images/Exhuma Poster.png",
      desc: "Thế giới Pandora lần thứ tư",
    },
    {
      id: 23,
      name: "Thám Tử Kiên 2: Lời Nguyền Hoàng Kim",
      genre: "Chính kịch",
      duration: 115,
      releaseDate: "2026-04-05",
      status: "Sắp chiếu",
      price: 85000,
      poster: "../assets/images/Mai Poster.png",
      desc: "Phần tiếp của thám tử Kiên",
    },
    {
      id: 24,
      name: "Avengers: Ngày Tận Thế",
      genre: "Siêu anh hùng",
      duration: 180,
      releaseDate: "2026-04-06",
      status: "Sắp chiếu",
      price: 125000,
      poster: "../assets/images/Kung Fu Panda Poster.png",
      desc: "Cuộc chiến cuối cùng của Avengers",
    },
  ];

  saveMovies();
}

// Hàm dùng để tự cập nhật trạng thái phim theo ngày khởi chiếu:
// - Nhỏ hơn hôm nay  -> Đã chiếu
// - Bằng hôm nay     -> Đang chiếu
// - Lớn hơn hôm nay  -> Sắp chiếu
function updateMovieStatus() {
  const now = new Date();
  const todayString =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}`;

  movies.forEach((movie) => {
    if (!movie.releaseDate) {
      return;
    }

    if (movie.releaseDate < todayString) {
      movie.status = "Đã chiếu";
    } else if (movie.releaseDate === todayString) {
      movie.status = "Đang chiếu";
    } else {
      movie.status = "Sắp chiếu";
    }
  });
}

setInterval(function () {
  updateMovieStatus();
  saveMovies();
  renderTable();
}, 60000);

// id ô input trong HTML — form THÊM
const addInputId = {
  name: "addName",
  genre: "addGenre",
  duration: "addDuration",
  releaseDate: "addDate",
  status: "addStatus",
  price: "addPrice",
  poster: "addPoster",
  desc: "addDesc",
};

// id ô input trong HTML — form SỬA
const editInputId = {
  name: "editName",
  genre: "editGenre",
  duration: "editDuration",
  releaseDate: "editDate",
  status: "editStatus",
  price: "editPrice",
  poster: "editPoster",
  desc: "editDesc",
};

// Khi user gõ vào ô nào → biết đang là form thêm hay sửa + tên trường (để xóa lỗi đúng chỗ)
const inputIdToField = {
  addName: { form: "add", field: "name" },
  addGenre: { form: "add", field: "genre" },
  addDuration: { form: "add", field: "duration" },
  addDate: { form: "add", field: "releaseDate" },
  addStatus: { form: "add", field: "status" },
  addPrice: { form: "add", field: "price" },
  addPoster: { form: "add", field: "poster" },
  addDesc: { form: "add", field: "desc" },
  editName: { form: "edit", field: "name" },
  editGenre: { form: "edit", field: "genre" },
  editDuration: { form: "edit", field: "duration" },
  editDate: { form: "edit", field: "releaseDate" },
  editStatus: { form: "edit", field: "status" },
  editPrice: { form: "edit", field: "price" },
  editPoster: { form: "edit", field: "poster" },
  editDesc: { form: "edit", field: "desc" },
};

// Hàm dùng để tạo id cho dòng báo lỗi đỏ dưới ô input (form thêm hoặc sửa phim).
function errorLineId(form, field) {
  return "errLine_" + form + "_" + field;
}

// Hàm dùng để chuyển chuỗi giá vé thành số (bỏ dấu chấm, phẩy, ký tự lạ).
function parsePriceNumber(price) {
  if (price === "" || price === null || price === undefined) {
    return NaN;
  }
  if (typeof price === "number") {
    return price;
  }

  let s = String(price);
  s = s.replace(/\./g, "");
  s = s.replace(/,/g, "");
  s = s.replace(/\s/g, "");
  s = s.replace(/[^\d-]/g, "");

  if (s === "" || s === "-") {
    return NaN;
  }

  return parseInt(s, 10);
}

// Hàm dùng để kiểm tra URL ảnh bìa có hợp lệ hay không (http/https hoặc đường dẫn tương đối).
function isValidPosterUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  const posterUrl = url.trim();
  if (posterUrl === "") {
    return false;
  }

  // Cho phép đường dẫn tương đối như ../assets/images/abc.png hoặc /assets/images/abc.png
  const isRelativePath = /^(\.{1,2}\/|\/)/.test(posterUrl) && !/\s/.test(posterUrl);
  if (isRelativePath) {
    return true;
  }

  // Cho phép URL tuyệt đối bắt đầu bằng http hoặc https
  try {
    const parsedUrl = new URL(posterUrl);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

// Hàm dùng để kiểm tra dữ liệu phim trước khi thêm/sửa; trả về object lỗi theo từng trường.
function validateMovie(data) {
  const err = {};

  if (!data.name || data.name.trim() === "") {
    err.name = "Tên phim không được để trống";
  }

  if (!data.genre || data.genre.trim() === "") {
    err.genre = "Thể loại không được để trống";
  }

  const duration = Number(data.duration);

  if (!data.duration || isNaN(duration) || duration <= 0) {
    err.duration = "Thời lượng không để trống và phải là số > 0";
  }

  if (!data.releaseDate) {
    err.releaseDate = "Ngày khởi chiếu không được để trống";
  } else {
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(data.releaseDate);
    if (!dateOk) {
      err.releaseDate = "Ngày khởi chiếu không hợp lệ";
    }
  }

  if (!data.status || data.status === "") {
    err.status = "Trạng thái phim không được để trống";
  }

  const giaSo = parsePriceNumber(data.price);
  if (isNaN(giaSo) || giaSo < 1) {
    err.price = "Giá vé không được để trống và phải hợp lệ (> 0 VNĐ)";
  }

  if (!data.poster || data.poster.trim() === "") {
    err.poster = "URL ảnh bìa phim không được để trống";
  } else if (!isValidPosterUrl(data.poster)) {
    err.poster = "URL ảnh bìa phim không hợp lệ";
  }

  if (!data.desc || data.desc.trim() === "") {
    err.desc = "Mô tả ngắn không được để trống";
  }


  return err;
}

// Hàm dùng để tạo hoặc lấy dòng chữ đỏ báo lỗi ngay dưới ô input.
function ensureErrorLineBelow(inputEl, form, field) {
  const id = errorLineId(form, field);
  let line = document.getElementById(id);
  if (!line) {
    line = document.createElement("p");
    line.id = id;
    line.style.margin = "6px 0 0";
    line.style.padding = "0";
    line.style.fontSize = "12px";
    line.style.color = "#f87171";
    inputEl.insertAdjacentElement("afterend", line);
  }
  return line;
}

// Hàm dùng để xóa hết viền đỏ và chữ lỗi ở form thêm phim.
function clearAddFormErrors() {
  Object.keys(addInputId).forEach((field) => {
    const idInput = addInputId[field];
    const input = document.getElementById(idInput);
    if (input) {
      input.style.borderColor = "";
      input.style.borderWidth = "";
      input.style.borderStyle = "";
    }
    const line = document.getElementById(errorLineId("add", field));
    if (line) {
      line.textContent = "";
    }
  });
}

// Hàm dùng để xóa hết viền đỏ và chữ lỗi ở form sửa phim.
function clearEditFormErrors() {
  Object.keys(editInputId).forEach((field) => {
    const idInput = editInputId[field];
    const input = document.getElementById(idInput);
    if (input) {
      input.style.borderColor = "";
      input.style.borderWidth = "";
      input.style.borderStyle = "";
    }
    const line = document.getElementById(errorLineId("edit", field));
    if (line) {
      line.textContent = "";
    }
  });
}

// Hàm dùng để hiển thị lỗi đỏ trên form thêm hoặc sửa phim theo object lỗi.
function showFormErrors(form, errObj) {
  let map;
  if (form === "add") {
    clearAddFormErrors();
    map = addInputId;
  } else {
    clearEditFormErrors();
    map = editInputId;
  }

  Object.keys(errObj).forEach((field) => {
    const msg = errObj[field];
    if (!msg) {
      return;
    }
    const idInput = map[field];
    const input = document.getElementById(idInput);
    if (!input) {
      return;
    }
    input.style.borderColor = "#ef4444";
    input.style.borderWidth = "1px";
    input.style.borderStyle = "solid";
    const line = ensureErrorLineBelow(input, form, field);
    line.textContent = msg;
  });
}

// Hàm dùng để khi user gõ lại vào ô thì xóa lỗi đỏ ở ô đó.
function onFormInputMaybeClearError(e) {
  const el = e.target;
  if (!el || !el.id) {
    return;
  }
  const info = inputIdToField[el.id];
  if (!info) {
    return;
  }
  const line = document.getElementById(errorLineId(info.form, info.field));
  if (line) {
    line.textContent = "";
  }
  el.style.borderColor = "";
  el.style.borderWidth = "";
  el.style.borderStyle = "";
}

// Hàm dùng để đóng modal thông báo lỗi validate (nếu có trên giao diện).
function closeValidationModal() {
  document.getElementById("validationModal").style.display = "none";
}

// Hàm dùng để lưu danh sách phim vào localStorage và cập nhật số đếm bộ lọc.
function saveMovies() {
  updateMovieStatus();
  localStorage.setItem(KEY, JSON.stringify(movies));
  updateFilterCounts();
}

// Hàm dùng để cập nhật số lượng phim theo từng trạng thái (tất cả / đang chiếu / ...).
function updateFilterCounts() {
  const all = movies.length;
  const showing = movies.filter((m) => m.status === "Đang chiếu").length;
  const coming = movies.filter((m) => m.status === "Sắp chiếu").length;
  const ended = movies.filter((m) => m.status === "Đã chiếu").length;

  document.getElementById("countAll").textContent = all;
  document.getElementById("countShowing").textContent = showing;
  document.getElementById("countComing").textContent = coming;
  document.getElementById("countEnded").textContent = ended;
}

// Hàm dùng để lấy danh sách phim sau khi lọc theo tab trạng thái và ô tìm kiếm.
function getFilteredMovies() {
  let filtered = movies;
  if (currentFilter !== "all") {
    filtered = filtered.filter((m) => m.status === currentFilter);
  }
  if (currentSearch) {
    filtered = filtered.filter((m) =>
      m.name.toLowerCase().includes(currentSearch.toLowerCase()),
    );
  }
  return filtered;
}

// Hàm dùng để vẽ lại bảng danh sách phim (theo trang hiện tại).
function renderTable() {
  const filtered = getFilteredMovies();
  const container = document.getElementById("tableContainer");

  if (filtered.length === 0) {
    container.innerHTML =
      '<div style=" display: flex; flex-direction: column; align-items: center; justify-content: center;text-align: center; padding: 40px; color: #999;"><i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>Không tìm thấy phim nào</div>';
    document.getElementById("itemStart").textContent = "0";
    document.getElementById("itemEnd").textContent = "0";
    document.getElementById("totalItems").textContent = "0";
    renderPagination(filtered);
    return;
  }

  let html = `
    <div class="table-head">
      <span>ẢNH BÌA</span>
      <span>TÊN PHIM</span>
      <span>THỂ LOẠI</span>
      <span>THỜI LƯỢNG</span>
      <span>NGÀY KHỞI CHIẾU</span>
      <span>TRẠNG THÁI</span>
      <span>THAO TÁC</span>
    </div>
  `;

  let start = (currentPage - 1) * perPage;
  let data = filtered.slice(start, start + perPage);

  data.forEach((m) => {
    const genreTags = (m.genre || "")
      .split(",")
      .map((g) => `<div class="tag">${g.trim()}</div>`)
      .join("");

    html += `
      <div class="table-row">
        <img src="${m.poster || ""}" alt="${m.name}" onerror="this.src='https://via.placeholder.com/60x75?text=${m.name.substring(0, 3)}'">
        <div class="movie-info">
          <div class="movie-title">${m.name}</div>
          <div class="movie-subtitle">${(m.desc || "").substring(0, 50)}${m.desc ? "..." : ""}</div>
        </div>
        <div class="genre-tags">${genreTags}</div>
        <div class="movie-durations">${m.duration} phút</div>
        <div class="release-date">${formatDate(m.releaseDate)}</div>
        <div class="status ${getStatusClass(m.status)}">${m.status}</div>
        <div class="actions-icon">
          <button onclick="openEditModal(${m.id})" title="Sửa"><i class="fa-solid fa-pen"></i></button>
          <button onclick="showDeleteModal(${m.id})" title="Xóa"><i class="fa-regular fa-circle-xmark"></i></button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  document.getElementById("itemStart").textContent = start + 1;
  document.getElementById("itemEnd").textContent = Math.min(
    start + perPage,
    filtered.length,
  );
  document.getElementById("totalItems").textContent = filtered.length;

  renderPagination(filtered);
}

// Hàm dùng để vẽ nút phân trang phía dưới bảng phim.
function renderPagination(filtered) {
  const total = Math.ceil(filtered.length / perPage);
  const controls = document.getElementById("paginationControls");
  
  if (!controls) return;
  
  controls.innerHTML = "";

  if (total <= 1) return;

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn";
    
    if (i === currentPage) {
      btn.classList.add("active");
    }
    
    btn.textContent = i;
    
    // Xử lý sự kiện khi nhấn vào số trang
    btn.onclick = function () {
      currentPage = i;
      renderTable();
      window.scrollTo(0, 0);
    };
    
    controls.appendChild(btn);
  }
}

// Hàm dùng để đổi ngày dạng YYYY-MM-DD sang DD/MM/YYYY để hiển thị.
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// Hàm dùng để trả về class CSS tương ứng trạng thái phim (màu badge).
function getStatusClass(status) {
  if (status === "Đang chiếu") return "showing";
  if (status === "Sắp chiếu") return "coming";
  if (status === "Đã chiếu") return "ended";
  return "";
}

// Hàm dùng để tìm phim theo tên (ô search) và vẽ lại bảng.
function searchMovies(query) {
  currentSearch = query;
  currentPage = 1;
  renderTable();
}

// Hàm dùng để lọc phim theo trạng thái (nút bộ lọc) và vẽ lại bảng.
function filterMovies(status, btn) {
  currentFilter = status;
  currentPage = 1;
  renderTable();

  document.querySelectorAll(".filter button").forEach((b) => {
    b.classList.remove("active");
  });
  btn.classList.add("active");
}

// -------- CHỨC NĂNG THÊM MỚI PHIM --------
// Hàm dùng để mở modal thêm phim và xóa lỗi cũ trên form.
function openAddModal() {
  clearAddForm();
  document.getElementById("addModal").style.display = "flex";
}

// Hàm dùng để đóng modal thêm phim và reset form.
function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  clearAddForm();
}

// Hàm dùng để xóa nội dung các ô trong form thêm phim.
function clearAddForm() {
  clearAddFormErrors();
  document.getElementById("addName").value = "";
  document.getElementById("addGenre").value = "";
  document.getElementById("addDuration").value = "";
  document.getElementById("addDate").value = "";
  document.getElementById("addStatus").value = "";
  document.getElementById("addPrice").value = "";
  document.getElementById("addPoster").value = "";
  document.getElementById("addDesc").value = "";
}

// Hàm dùng để đọc form thêm phim, validate, lưu phim mới và vẽ lại bảng.
function addMovie() {
  const formData = {
    name: document.getElementById("addName").value.trim(),
    genre: document.getElementById("addGenre").value.trim(),
    duration: document.getElementById("addDuration").value,
    releaseDate: document.getElementById("addDate").value,
    status: document.getElementById("addStatus").value,
    price: document.getElementById("addPrice").value,
    poster: document.getElementById("addPoster").value.trim(),
    desc: document.getElementById("addDesc").value.trim(),
  };

  const fieldErrors = validateMovie(formData);
  if (Object.keys(fieldErrors).length > 0) {
    showFormErrors("add", fieldErrors);
    return;
  }

  const movie = {
    id: Date.now(),
    ...formData,
    duration: parseInt(formData.duration, 10),
    price: parsePriceNumber(formData.price),
  };

  movies.push(movie);
  saveMovies();
  closeAddModal();
  currentPage = 1;
  currentFilter = "all";
  currentSearch = "";
  renderTable();
  showAlert("Thêm phim thành công!", "success");
}

// -------- CHỨC NĂNG CẬP NHẬT PHIM --------
// Hàm dùng để mở modal sửa phim và đổ dữ liệu phim đang chọn vào form.
function openEditModal(id) {
  const movie = movies.find((m) => m.id === id);
  if (!movie) return;

  clearEditFormErrors();
  editingId = id;
  document.getElementById("editName").value = movie.name;
  document.getElementById("editGenre").value = movie.genre;
  document.getElementById("editDuration").value = movie.duration;
  document.getElementById("editDate").value = movie.releaseDate;
  document.getElementById("editStatus").value = movie.status;
  document.getElementById("editPrice").value = movie.price;
  document.getElementById("editPoster").value = movie.poster;
  document.getElementById("editDesc").value = movie.desc;

  document.getElementById("editModal").style.display = "flex";
}

// Hàm dùng để đóng modal sửa phim.
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editingId = null;
}

// Hàm dùng để lưu thay đổi phim sau khi sửa form và cập nhật bảng.
function updateMovie() {
  const movie = movies.find((m) => m.id === editingId);
  if (!movie) return;

  const formData = {
    name: document.getElementById("editName").value.trim(),
    genre: document.getElementById("editGenre").value.trim(),
    duration: document.getElementById("editDuration").value,
    releaseDate: document.getElementById("editDate").value,
    status: document.getElementById("editStatus").value,
    price: document.getElementById("editPrice").value,
    poster: document.getElementById("editPoster").value.trim(),
    desc: document.getElementById("editDesc").value.trim(),
  };

  const fieldErrors = validateMovie(formData);
  if (Object.keys(fieldErrors).length > 0) {
    showFormErrors("edit", fieldErrors);
    return;
  }

  movie.name = formData.name;
  movie.genre = formData.genre;
  movie.duration = parseInt(formData.duration, 10);
  movie.releaseDate = formData.releaseDate;
  movie.status = formData.status;
  movie.price = parsePriceNumber(formData.price);
  movie.poster = formData.poster;
  movie.desc = formData.desc;

  saveMovies();
  closeEditModal();
  renderTable();
  showAlert("Cập nhật phim thành công!", "success");
}

// -------- CHỨC NĂNG XÓA PHIM --------
// Hàm dùng để mở modal xác nhận xóa phim.
function showDeleteModal(id) {
  const movie = movies.find((m) => m.id === id);
  if (!movie) return;

  deleteMovieId = id;
  document.getElementById("deleteMovieName").textContent = movie.name;
  document.getElementById("deleteModal").style.display = "flex";
}

// Hàm dùng để đóng modal xóa phim mà không xóa.
function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
  deleteMovieId = null;
}

// Hàm dùng để xác nhận xóa phim khỏi danh sách và localStorage.
function confirmDeleteMovie() {
  if (deleteMovieId === null) return;

  movies = movies.filter((m) => m.id !== deleteMovieId);
  saveMovies();
  closeDeleteModal();
  renderTable();
  showAlert("Xóa phim thành công!", "success");
  deleteMovieId = null;
}

// ============ UI CHUNG (TAB, ĐĂNG XUẤT, THÔNG BÁO) ============
// Hàm dùng để chuyển tab Quản lý phim / Quản lý vé và load dữ liệu tab vé nếu cần.
function switchTab(index) {
  document.querySelectorAll(".tab").forEach((tab, i) => {
    tab.classList.toggle("tab-select", i === index);
  });

  document.getElementById("movieTab").style.display =
    index === 0 ? "block" : "none";
  document.getElementById("ticketTab").style.display =
    index === 1 ? "block" : "none";

  if (index === 1) {
    ticketPage = 1;
    ticketSearchText = "";
    const inp = document.getElementById("ticketSearchInput");
    if (inp) inp.value = "";
    updateTicketStats();
    renderTicketTable();
  }
}

// Hàm dùng để mở modal xác nhận đăng xuất.
function showLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

// Hàm dùng để đóng modal đăng xuất.
function hideLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

// Hàm dùng để đăng xuất và chuyển về trang đăng nhập.
function logout() {
  showAlert("Đăng xuất thành công!", "success");
  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
}

// Hàm dùng để hiện thông báo dạng toast (góc màn hình).
function showAlert(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const safeType =
    type === "success" || type === "warning" || type === "error" || type === "info"
      ? type
      : "info";
  const safeMsg = String(message || "");

  while (container.children.length >= 4) {
    container.removeChild(container.firstChild);
  }

  const el = document.createElement("div");
  el.className = "toast " + safeType;
  el.innerHTML =
    '<div class="toast-icon" aria-hidden="true"></div>' +
    "<div>" +
    '<div class="toast-title">' +
    (safeType === "success"
      ? "Thành công"
      : safeType === "warning"
        ? "Lưu ý"
        : safeType === "error"
          ? "Lỗi"
          : "Thông báo") +
    "</div>" +
    '<div class="toast-msg">' +
    safeMsg +
    "</div>" +
    "</div>";

  container.appendChild(el);
  requestAnimationFrame(function () {
    el.classList.add("show");
  });

  setTimeout(function () {
    el.classList.remove("show");
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 260);
  }, 2600);
}

// =========================================================
// ================ PHẦN 2: QUẢN LÝ VÉ =====================
// =========================================================
// -------- CHỨC NĂNG HIỂN THỊ & TÌM KIẾM VÉ --------

const TICKET_KEY = "rikkei_tickets";
let tickets = JSON.parse(localStorage.getItem(TICKET_KEY)) || [];
let ticketPage = 1;
let ticketPerPage = 5;
let ticketSearchText = "";
let editingTicketId = null;
let cancelTicketTargetId = null;

// Hàm dùng để lưu danh sách vé vào localStorage.
function saveTickets() {
  localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
}

// Hàm dùng để trả về mảng 5 vé mẫu (dữ liệu demo khi chưa có vé).
function layVeMau5Ve() {
  return [
    {
      id: 1001,
      ticketCode: "VE-1001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0987654321",
      movieId: 1,
      movieTitle: "Dune: Hành Tinh Cát - Phần 2",
      showDate: "2024-03-15",
      showTime: "10:00",
      seats: ["F12", "F13"],
      seatCount: 2,
      pricePerSeat: 90000,
      totalAmount: 180000,
      paymentMethod: 0,
      paymentStatus: true,
      createdAt: "2024-03-10T14:30:00.000Z",
      note: "Khách yêu cầu ghế gần lối đi",
      statusDisplay: "Đã Thanh Toán",
      cancelled: false,
    },
    {
      id: 1002,
      ticketCode: "VE-1002",
      customerName: "Trần Thị B",
      customerPhone: "0912345678",
      movieId: 4,
      movieTitle: "Mai",
      showDate: "2024-03-16",
      showTime: "13:30",
      seats: ["G5"],
      seatCount: 1,
      pricePerSeat: 90000,
      totalAmount: 90000,
      paymentMethod: 1,
      paymentStatus: false,
      createdAt: "2024-03-10T15:00:00.000Z",
      note: "",
      statusDisplay: "Chờ xử lý",
      cancelled: false,
    },
    {
      id: 1003,
      ticketCode: "VE-1003",
      customerName: "Lê Văn C",
      customerPhone: "0909888777",
      movieId: 2,
      movieTitle: "Kung Fu Panda 4",
      showDate: "2024-03-17",
      showTime: "19:00",
      seats: ["H10", "H11", "H12"],
      seatCount: 3,
      pricePerSeat: 90000,
      totalAmount: 270000,
      paymentMethod: 0,
      paymentStatus: true,
      createdAt: "2024-03-10T16:00:00.000Z",
      note: "Combo bắp nước tặng kèm",
      statusDisplay: "Đã Thanh Toán",
      cancelled: false,
    },
    {
      id: 1004,
      ticketCode: "VE-1004",
      customerName: "Phạm Minh D",
      customerPhone: "0933111222",
      movieId: 5,
      movieTitle: "Exhuma: Quật Mộ Trùng Ma",
      showDate: "2024-03-14",
      showTime: "21:45",
      seats: ["E8"],
      seatCount: 1,
      pricePerSeat: 90000,
      totalAmount: 90000,
      paymentMethod: 0,
      paymentStatus: false,
      createdAt: "2024-03-09T10:00:00.000Z",
      note: "Khách hủy do bận đột xuất",
      statusDisplay: "Đã hủy",
      cancelled: true,
    },
    {
      id: 1005,
      ticketCode: "VE-1005",
      customerName: "Hoàng Yến E",
      customerPhone: "0977111222",
      movieId: 3,
      movieTitle: "Godzilla x Kong: Đế Chế Mới",
      showDate: "2024-03-18",
      showTime: "09:15",
      seats: ["D4", "D5"],
      seatCount: 2,
      pricePerSeat: 90000,
      totalAmount: 180000,
      paymentMethod: 1,
      paymentStatus: false,
      createdAt: "2024-03-11T09:00:00.000Z",
      note: "Chờ xác nhận thanh toán chuyển khoản",
      statusDisplay: "Chờ xử lý",
      cancelled: false,
    },
  ];
}

const MAU_VE_PHIEN = "mau_5ve_json_2024";
if (localStorage.getItem("rikkei_ve_mau_phien") !== MAU_VE_PHIEN) {
  tickets = layVeMau5Ve();
  saveTickets();
  localStorage.setItem("rikkei_ve_mau_phien", MAU_VE_PHIEN);
}

// Hàm dùng để format số tiền vé theo chuẩn Việt Nam (có ký hiệu ₫).
const formatMoneyTicket = (amount) => {
  return Number(amount || 0).toLocaleString("vi-VN") + "₫";
};

// Hàm dùng để đổi mã số phương thức thanh toán sang chữ hiển thị.
const paymentMethodLabel = (code) => {
  if (code === 0) return "Tiền mặt";
  if (code === 1) return "Chuyển khoản";
  return "Khác";
};

// Hàm dùng để lọc danh sách phim đang chiếu (dùng cho form vé).
const getShowingMovies = () => {
  return movies.filter((movie) => movie.status === "Đang chiếu");
};

// Hàm dùng để tạo danh sách suất chiếu giả lập cho 7 ngày tới (dùng cho select suất).
const getShowOptionsForMovie = (movieId) => {
  const selectedMovie = movies.find((movie) => movie.id === movieId);
  if (!selectedMovie) return [];

  const showTimes = ["10:00", "14:00", "19:30"];
  const now = new Date();
  const showOptions = [];

  Array.from({ length: 7 }, (_, dayOffset) => dayOffset).forEach((dayOffset) => {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const showDate = `${year}-${month}-${day}`;

    showTimes.forEach((showTime) => {
      showOptions.push({ showDate, showTime });
    });
  });

  return showOptions;
};

// Hàm dùng để chuyển chuỗi ghế (ví dụ "F1, F2") thành mảng ghế đã chuẩn hóa.
const parseSeatString = (seatText) => {
  if (!seatText || !seatText.trim()) return [];
  return seatText
    .split(",")
    .map((seat) => seat.trim().toUpperCase())
    .filter(Boolean);
};

// Hàm dùng để kiểm tra định dạng ghế cơ bản (ví dụ: F12).
const isSeatFormatValid = (seats) => {
  return seats.length > 0 && seats.every((seat) => /^[A-Z][0-9]{1,2}$/.test(seat));
};

// Hàm dùng để kiểm tra ghế có bị trùng với vé khác cùng phim và suất chiếu hay không.
const hasSeatConflict = (movieId, showDate, showTime, seats) => {
  return tickets.some((ticket) => {
    if (ticket.cancelled) return false;
    if (ticket.movieId !== movieId) return false;
    if (ticket.showDate !== showDate || ticket.showTime !== showTime) return false;
    return seats.some((seat) => ticket.seats.includes(seat));
  });
};

// Hàm dùng để kiểm tra suất chiếu còn hiệu lực (trong tương lai hoặc đang diễn ra).
const isShowTimeBookable = (showDate, showTime, movieDurationMinutes) => {
  if (!showDate || !showTime) return false;
  const showStart = new Date(`${showDate}T${showTime}:00`);
  if (Number.isNaN(showStart.getTime())) return false;
  const duration = Number(movieDurationMinutes) || 120;
  const showEnd = new Date(showStart.getTime() + duration * 60 * 1000);
  const now = new Date();
  return now <= showEnd;
};

// Hàm dùng để đổ danh sách khách từ localStorage vào ô chọn khách (form thêm vé).
const fillCustomerSelect = () => {
  const customerSelect = document.getElementById("ticketAddCustomer");
  if (!customerSelect) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.length === 0) {
    users = [
      {
        id: Date.now(),
        fullName: "Khách vãng lai",
        email: "khachvanglai@example.com",
        phone: "0900000000",
        role: "user",
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  customerSelect.innerHTML = '<option value="">-- Chọn khách --</option>';

  users.forEach((user) => {
    const customerName = user.fullName || "Khách lẻ";
    const customerPhone = user.phone || user.email || "000";
    const option = document.createElement("option");
    option.value = `${customerName}|${customerPhone}`;
    option.textContent = `${customerName} — ${customerPhone}`;
    customerSelect.appendChild(option);
  });
};

// Hàm dùng để đổ danh sách phim đang chiếu vào ô chọn phim (form thêm vé).
const fillTicketMovieSelects = () => {
  const movieSelect = document.getElementById("ticketAddMovie");
  if (!movieSelect) return;

  movieSelect.innerHTML = '<option value="">-- Phim đang chiếu --</option>';
  getShowingMovies().forEach((movie) => {
    const option = document.createElement("option");
    option.value = movie.id;
    option.textContent = movie.name;
    movieSelect.appendChild(option);
  });
};

// Hàm dùng để đổ các suất chiếu vào select theo phim đã chọn.
const fillShowSelect = (selectElement, movieId, keepValue = "") => {
  if (!selectElement) return;
  selectElement.innerHTML = '<option value="">-- Chọn suất --</option>';
  if (!movieId) return;

  getShowOptionsForMovie(Number(movieId)).forEach((show) => {
    const option = document.createElement("option");
    option.value = `${show.showDate}|${show.showTime}`;
    option.textContent = `${formatDate(show.showDate)} — ${show.showTime}`;
    selectElement.appendChild(option);
  });

  if (keepValue) {
    selectElement.value = keepValue;
  }
};

// Hàm dùng để khi đổi phim trong form thêm vé thì load lại suất và tính lại tiền.
const onTicketAddMovieChange = () => {
  const movieId = document.getElementById("ticketAddMovie").value;
  fillShowSelect(document.getElementById("ticketAddShow"), movieId);
  updateTicketAddTotal();
};

// Hàm dùng để lấy giá vé của phim đang chọn trong form thêm vé.
const getTicketAddMoviePrice = () => {
  const movieId = document.getElementById("ticketAddMovie").value;
  if (!movieId) return 0;
  const selectedMovie = movies.find((movie) => String(movie.id) === String(movieId));
  return selectedMovie ? selectedMovie.price : 0;
};

// Hàm dùng để cập nhật số lượng vé và tổng tiền dự kiến ở form thêm vé.
const updateTicketAddTotal = () => {
  const unitPrice = getTicketAddMoviePrice();
  const seatList = parseSeatString(document.getElementById("ticketAddSeats").value);
  const totalAmount = seatList.length * unitPrice;

  document.getElementById("ticketAddTotalPreview").textContent =
    formatMoneyTicket(totalAmount);
  document.getElementById("ticketAddSeatBreakdown").textContent =
    `${seatList.length} vé x ${unitPrice.toLocaleString("vi-VN")} đ`;
};

// Hàm dùng để reset toàn bộ form thêm vé.
const resetAddTicketForm = () => {
  const customer = document.getElementById("ticketAddCustomer");
  const movie = document.getElementById("ticketAddMovie");
  const show = document.getElementById("ticketAddShow");
  const seats = document.getElementById("ticketAddSeats");
  const payMethod = document.getElementById("ticketAddPayMethod");
  const payStatus = document.getElementById("ticketAddPayStatus");

  if (customer) customer.value = "";
  if (movie) movie.value = "";
  if (show) show.value = "";
  if (seats) seats.value = "";
  if (payMethod) payMethod.value = "";
  if (payStatus) payStatus.value = "1";
  updateTicketAddTotal();
};

// Hàm dùng để cập nhật các số thống kê trên tab vé (vé hôm nay, doanh thu, chờ xử lý).
const updateTicketStats = () => {
  const today = new Date().toISOString().slice(0, 10);
  const activeTickets = tickets.filter((ticket) => !ticket.cancelled);
  const ticketsToday = activeTickets.filter(
    (ticket) => (ticket.createdAt || "").slice(0, 10) === today,
  );
  const revenueToday = ticketsToday
    .filter((ticket) => ticket.paymentStatus)
    .reduce((total, ticket) => total + ticket.totalAmount, 0);
  const pendingCount = activeTickets.filter((ticket) => !ticket.paymentStatus).length;

  document.getElementById("statTicketsToday").textContent = ticketsToday.length;
  document.getElementById("statRevenueToday").textContent =
    `${(revenueToday / 1000000).toFixed(1)}tr₫`;
  document.getElementById("statPendingTickets").textContent = pendingCount;
};

// Hàm dùng để lọc danh sách vé theo ô tìm kiếm (mã vé, tên, SĐT).
const getFilteredTickets = () => {
  const query = ticketSearchText.toLowerCase().trim().replace(/^#/, "");
  if (!query) return [...tickets];

  return tickets.filter((ticket) => {
    const ticketCode = (ticket.ticketCode || "").toLowerCase();
    const customerName = (ticket.customerName || "").toLowerCase();
    const customerPhone = (ticket.customerPhone || "").toLowerCase();
    return (
      ticketCode.includes(query) ||
      customerName.includes(query) ||
      customerPhone.includes(query)
    );
  });
};

// Hàm dùng để vẽ lại bảng danh sách vé (phân trang theo trang hiện tại).
const renderTicketTable = () => {
  const filteredTickets = getFilteredTickets();
  const container = document.getElementById("ticketTableContainer");
  if (!container) return;

  if (filteredTickets.length === 0) {
    container.innerHTML =
      '<div style="text-align:center;padding:40px;color:#999;">Chưa có vé nào</div>';
    document.getElementById("ticketItemStart").textContent = "0";
    document.getElementById("ticketItemEnd").textContent = "0";
    document.getElementById("ticketTotalItems").textContent = "0";
    document.getElementById("ticketPaginationControls").innerHTML = "";
    return;
  }

  const startIndex = (ticketPage - 1) * ticketPerPage;
  const pageTickets = filteredTickets.slice(startIndex, startIndex + ticketPerPage);

  let html = "";
  html += '<div class="ticket-table-head">';
  html += "<span>Mã vé</span><span>Khách hàng</span><span>Phim</span>";
  html += "<span>Suất chiếu</span><span>Ghế</span><span>Tổng tiền</span>";
  html += "<span>Trạng thái</span><span style='text-align:center'>Thao tác</span>";
  html += "</div>";

  pageTickets.forEach((ticket) => {
    const seatTags = ticket.seats
      .map((seat) => `<span class="ticket-seat-tag">${seat}</span>`)
      .join("");
    const statusClass = ticket.cancelled
      ? "ticket-pill-cancel"
      : ticket.paymentStatus
        ? "ticket-pill-paid"
        : "ticket-pill-pending";

    html += '<div class="ticket-table-row">';
    html += `<span class="ticket-code">#${ticket.ticketCode}</span>`;
    html += `<span><div class="ticket-cust-name">${ticket.customerName}</div>`;
    html += `<div class="ticket-cust-phone">${ticket.customerPhone}</div></span>`;
    html += `<span class="ticket-movie-title">${ticket.movieTitle}</span>`;
    html += `<span><div class="ticket-show-main">${ticket.showTime}</div>`;
    html += `<div class="ticket-show-sub">${formatDate(ticket.showDate)}</div></span>`;
    html += `<span class="ticket-seat-tags">${seatTags}</span>`;
    html += `<span class="ticket-money">${formatMoneyTicket(ticket.totalAmount)}</span>`;
    html += `<span><span class="ticket-pill ${statusClass}">${ticket.statusDisplay}</span></span>`;
    html += '<span class="ticket-actions-cell">';
    html += `<button type="button" onclick="openEditTicketModal(${ticket.id})" title="Sửa vé"><i class="fa-solid fa-pen"></i></button>`;
    html += `<button type="button" onclick="openCancelTicketModal(${ticket.id})" title="Hủy vé"><i class="fa-regular fa-circle-xmark"></i></button>`;
    html += "</span></div>";
  });

  container.innerHTML = html;
  document.getElementById("ticketItemStart").textContent = startIndex + 1;
  document.getElementById("ticketItemEnd").textContent = Math.min(
    startIndex + ticketPerPage,
    filteredTickets.length,
  );
  document.getElementById("ticketTotalItems").textContent = filteredTickets.length;

  renderTicketPagination(filteredTickets.length);
};

// Hàm dùng để vẽ nút phân trang cho bảng vé.
const renderTicketPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / ticketPerPage);
  const controls = document.getElementById("ticketPaginationControls");
  
  if (!controls) return;
  controls.innerHTML = "";
  
  if (totalPages <= 1) return;

  Array.from({ length: totalPages }, (_, index) => index + 1).forEach((pageNumber) => {
    const pageButton = document.createElement("button");
    pageButton.className = "pagination-btn";
    pageButton.textContent = pageNumber;
    
    if (pageNumber === ticketPage) {
        pageButton.classList.add("active");
    }

    pageButton.onclick = () => {
      ticketPage = pageNumber;
      renderTicketTable();
      window.scrollTo(0, 0); 
    };
    
    controls.appendChild(pageButton);
  });
};

// Hàm dùng để gán nội dung ô tìm kiếm vé và vẽ lại bảng.
const searchTickets = (value) => {
  ticketSearchText = value;
  ticketPage = 1;
  renderTicketTable();
};

// -------- CHỨC NĂNG THÊM MỚI VÉ --------
// Hàm dùng để mở modal thêm vé.
const openAddTicketModal = () => {
  fillCustomerSelect();
  fillTicketMovieSelects();
  fillShowSelect(document.getElementById("ticketAddShow"), "");
  clearTicketAddFormErrors();
  resetAddTicketForm();
  document.getElementById("addTicketModal").style.display = "flex";
};

// Hàm dùng để đóng modal thêm vé và xóa lỗi validate trên form.
const closeAddTicketModal = () => {
  document.getElementById("addTicketModal").style.display = "none";
  clearTicketAddFormErrors();
  resetAddTicketForm();
};

// Hàm dùng để map tên trường logic sang id ô input trong HTML (form thêm vé).
const getTicketAddInputMap = () => {
  return {
    customer: "ticketAddCustomer",
    movie: "ticketAddMovie",
    show: "ticketAddShow",
    seats: "ticketAddSeats",
    paymentMethod: "ticketAddPayMethod",
    paymentStatus: "ticketAddPayStatus",
  };
};

// Hàm dùng để tạo id cho thẻ `<p>` hiển thị lỗi đỏ dưới từng ô form thêm vé.
const getTicketAddErrorId = (fieldName) => {
  return `errLine_ticketAdd_${fieldName}`;
};

// Hàm dùng để tạo hoặc lấy dòng lỗi đỏ ngay dưới ô input/select form thêm vé.
const ensureTicketAddErrorLine = (inputElement, fieldName) => {
  const lineId = getTicketAddErrorId(fieldName);
  let line = document.getElementById(lineId);
  if (!line) {
    line = document.createElement("p");
    line.id = lineId;
    line.className = "ticket-field-error";
    line.style.margin = "6px 0 0";
    line.style.padding = "0";
    line.style.fontSize = "12px";
    line.style.color = "#f87171";
    const nextElement = inputElement.nextElementSibling;
    if (fieldName === "seats" && nextElement && nextElement.classList.contains("ticket-hint")) {
      nextElement.insertAdjacentElement("afterend", line);
    } else {
      inputElement.insertAdjacentElement("afterend", line);
    }
  }
  return line;
};

// Hàm dùng để xóa hết viền đỏ và chữ lỗi trên form thêm vé.
const clearTicketAddFormErrors = () => {
  const ticketAddInputMap = getTicketAddInputMap();
  Object.keys(ticketAddInputMap).forEach((fieldName) => {
    const inputElement = document.getElementById(ticketAddInputMap[fieldName]);
    if (inputElement) {
      inputElement.style.borderColor = "";
      inputElement.style.borderWidth = "";
      inputElement.style.borderStyle = "";
    }
    const errorLine = document.getElementById(getTicketAddErrorId(fieldName));
    if (errorLine) {
      errorLine.textContent = "";
    }
  });
};

// Hàm dùng để hiển thị lỗi đỏ theo từng ô trong form thêm vé (object lỗi).
const showTicketAddFormErrors = (errorObject) => {
  clearTicketAddFormErrors();
  const ticketAddInputMap = getTicketAddInputMap();

  Object.keys(errorObject).forEach((fieldName) => {
    const message = errorObject[fieldName];
    if (!message) return;

    const inputId = ticketAddInputMap[fieldName];
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.style.borderColor = "#ef4444";
    inputElement.style.borderWidth = "1px";
    inputElement.style.borderStyle = "solid";
    inputElement.style.boxShadow = "0 0 0 1px rgba(239,68,68,0.25)";
    const errorLine = ensureTicketAddErrorLine(inputElement, fieldName);
    errorLine.textContent = message;
  });
};

// Hàm dùng để khi user gõ lại vào ô form thêm vé thì xóa lỗi ở ô đó.
const onTicketAddInputMaybeClearError = (event) => {
  const targetElement = event.target;
  if (!targetElement || !targetElement.id) return;

  const fieldByInputId = {
    ticketAddCustomer: "customer",
    ticketAddMovie: "movie",
    ticketAddShow: "show",
    ticketAddSeats: "seats",
    ticketAddPayMethod: "paymentMethod",
    ticketAddPayStatus: "paymentStatus",
  };

  const fieldName = fieldByInputId[targetElement.id];
  if (!fieldName) return;

  const errorLine = document.getElementById(getTicketAddErrorId(fieldName));
  if (errorLine) {
    errorLine.textContent = "";
  }
  targetElement.style.borderColor = "";
  targetElement.style.borderWidth = "";
  targetElement.style.borderStyle = "";
  targetElement.style.boxShadow = "";
};

// Hàm dùng để kiểm tra form thêm vé cơ bản và trả object lỗi theo từng trường.
const validateTicketAddForm = (formData) => {
  const errors = {};
  if (!formData.customerValue) {
    errors.customer = "Khách hàng không được để trống";
  }
  if (!formData.movieId) {
    errors.movie = "Phim không được để trống";
  } else {
    const isShowingMovie = getShowingMovies().some(
      (movie) => String(movie.id) === String(formData.movieId),
    );
    if (!isShowingMovie) {
      errors.movie = "Chỉ được chọn phim đang chiếu";
    }
  }
  if (!formData.showValue) {
    errors.show = "Suất chiếu không được để trống";
  } else {
    const validShowValues = getShowOptionsForMovie(Number(formData.movieId)).map(
      (show) => `${show.showDate}|${show.showTime}`,
    );
    if (!validShowValues.includes(formData.showValue)) {
      errors.show = "Suất chiếu phải thuộc phim đã chọn";
    }
  }
  if (!formData.seatText.trim()) {
    errors.seats = "Ghế không được để trống";
  } else if (!isSeatFormatValid(formData.seatList)) {
    errors.seats = "Ghế không đúng định dạng (ví dụ: F12, F13)";
  } else {
    const uniqueSeats = new Set(formData.seatList);
    if (uniqueSeats.size !== formData.seatList.length) {
      errors.seats = "Danh sách ghế đang bị trùng";
    }
    if (
      !errors.seats &&
      hasSeatConflict(formData.movieId, formData.showDate, formData.showTime, formData.seatList)
    ) {
      errors.seats = "Ghế đã có người đặt cho suất chiếu này";
    }
  }
  if (!formData.payMethod) {
    errors.paymentMethod = "Phương thức thanh toán không được để trống";
  }

  if (!formData.selectedMovie) {
    errors.movie = errors.movie || "Phim không hợp lệ";
  } else if (
    !isShowTimeBookable(formData.showDate, formData.showTime, formData.selectedMovie.duration)
  ) {
    errors.show = "Ngày/giờ suất chiếu đã qua, vui lòng chọn suất khác";
  }

  const expectedTotal = formData.seatList.length * (formData.selectedMovie?.price || 0);
  if (expectedTotal <= 0) {
    errors.seats = errors.seats || "Không thể tính tổng tiền từ ghế đã nhập";
  }
  return errors;
};

// Hàm dùng để tính id vé tiếp theo (lớn nhất trong danh sách + 1).
const generateNextTicketId = () => {
  const maxId = tickets.reduce((maxValue, ticket) => Math.max(maxValue, ticket.id), 1000);
  return maxId + 1;
};

// Hàm dùng để lưu vé mới từ form.
const saveNewTicket = () => {
  const customerValue = document.getElementById("ticketAddCustomer").value;
  const movieId = Number(document.getElementById("ticketAddMovie").value);
  const showValue = document.getElementById("ticketAddShow").value;
  const seatText = document.getElementById("ticketAddSeats").value;
  const payMethod = document.getElementById("ticketAddPayMethod").value;
  const payStatus = document.getElementById("ticketAddPayStatus").value;

  const [showDate = "", showTime = ""] = showValue.split("|");
  const seatList = parseSeatString(seatText);
  const selectedMovie = movies.find((movie) => movie.id === movieId);
  const [customerName = "", customerPhone = ""] = customerValue.split("|");
  const expectedTotal = seatList.length * (selectedMovie?.price || 0);

  const formData = {
    customerValue,
    movieId,
    showValue,
    showDate,
    showTime,
    seatText,
    seatList,
    payMethod,
    payStatus,
    selectedMovie,
    expectedTotal,
  };

  const errors = validateTicketAddForm(formData);
  if (Object.keys(errors).length > 0) {
    showTicketAddFormErrors(errors);
    return;
  }

  const nextId = generateNextTicketId();
  const newTicket = {
    id: nextId,
    ticketCode: `VE-${nextId}`,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    movieId: selectedMovie.id,
    movieTitle: selectedMovie.name,
    showDate,
    showTime,
    seats: seatList,
    seatCount: seatList.length,
    pricePerSeat: selectedMovie.price,
    totalAmount: expectedTotal,
    paymentMethod: Number(payMethod),
    paymentStatus: payStatus === "1",
    createdAt: new Date().toISOString(),
    note: "",
    statusDisplay: payStatus === "1" ? "Đã Thanh Toán" : "Chờ xử lý",
    cancelled: false,
  };

  tickets.unshift(newTicket);
  saveTickets();
  closeAddTicketModal();
  ticketPage = 1;
  ticketSearchText = "";
  const ticketSearchInput = document.getElementById("ticketSearchInput");
  if (ticketSearchInput) {
    ticketSearchInput.value = "";
  }
  updateTicketStats();
  renderTicketTable();
  showAlert("Đặt vé thành công!", "success");
};

// -------- CHỨC NĂNG CẬP NHẬT VÉ --------
const openEditTicketModal = (id) => {
  const selectedTicket = tickets.find((ticket) => ticket.id === id);
  if (selectedTicket && selectedTicket.paymentStatus) {
    showAlert("Vé đã thanh toán: không cho đổi phim/suất chiếu.", "warning");
    return;
  }
  showAlert("Chức năng cập nhật vé sẽ được phát triển sau", "info");
};

// Hàm dùng để đóng modal sửa vé (giữ trong HTML gọi onclick).
const closeEditTicketModal = () => {
  const editTicketModal = document.getElementById("editTicketModal");
  if (editTicketModal) {
    editTicketModal.style.display = "none";
  }
};

// Hàm dùng để giữ tương thích HTML (onchange phim sửa vé); rỗng vì đang tắt sửa vé.
const onTicketEditMovieChange = () => {};

// Hàm dùng để giữ tương thích HTML (onchange trạng thái thanh toán sửa vé); rỗng.
const onTicketEditPayStatusChange = () => {};

// Hàm dùng để giữ tương thích HTML (oninput ghế sửa vé); rỗng.
const updateTicketEditTotal = () => {};

// Hàm dùng để (khi bật lại) lưu sửa vé; hiện chỉ báo chức năng đang tắt.
const saveEditTicket = () => {
  showAlert("Chức năng cập nhật vé đang tạm tắt theo yêu cầu dự án.", "info");
};

// -------- CHỨC NĂNG HỦY VÉ --------
// Hàm dùng để mở modal xác nhận hủy vé (trước khi đánh dấu hủy trong dữ liệu).
const openCancelTicketModal = (id) => {
  const selectedTicket = tickets.find((ticket) => ticket.id === id);
  if (!selectedTicket) return;
  if (selectedTicket.cancelled) {
    showAlert("Vé này đã hủy rồi.", "warning");
    return;
  }

  cancelTicketTargetId = id;
  document.getElementById("cancelTicketCodeText").textContent = selectedTicket.ticketCode;
  document.getElementById("cancelTicketModal").style.display = "flex";
};

// Hàm dùng để đóng modal hủy vé mà không hủy.
const closeCancelTicketModal = () => {
  document.getElementById("cancelTicketModal").style.display = "none";
  cancelTicketTargetId = null;
};

// Hàm dùng để xác nhận hủy vé, cập nhật vé trong mảng và lưu localStorage.
const confirmCancelTicket = () => {
  if (cancelTicketTargetId === null) return;
  const selectedTicket = tickets.find((ticket) => ticket.id === cancelTicketTargetId);
  if (!selectedTicket) return;

  selectedTicket.cancelled = true;
  selectedTicket.statusDisplay = "Đã hủy";
  saveTickets();
  updateTicketStats();
  closeCancelTicketModal();
  renderTicketTable();
  showAlert("Đã hủy vé thành công.", "success");
};

// Hàm dùng để gán các hàm xử lý vé lên `window` để `onclick` trong HTML gọi được.
const exposeTicketFunctionsToWindow = () => {
  window.onTicketAddMovieChange = onTicketAddMovieChange;
  window.updateTicketAddTotal = updateTicketAddTotal;
  window.openAddTicketModal = openAddTicketModal;
  window.closeAddTicketModal = closeAddTicketModal;
  window.saveNewTicket = saveNewTicket;
  window.openEditTicketModal = openEditTicketModal;
  window.closeEditTicketModal = closeEditTicketModal;
  window.onTicketEditMovieChange = onTicketEditMovieChange;
  window.onTicketEditPayStatusChange = onTicketEditPayStatusChange;
  window.updateTicketEditTotal = updateTicketEditTotal;
  window.saveEditTicket = saveEditTicket;
  window.openCancelTicketModal = openCancelTicketModal;
  window.closeCancelTicketModal = closeCancelTicketModal;
  window.confirmCancelTicket = confirmCancelTicket;
};
exposeTicketFunctionsToWindow();

// ============ EVENT LISTENERS ============
document.getElementById("addModal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("addModal")) closeAddModal();
});

document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("editModal")) closeEditModal();
});

document.getElementById("deleteModal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("deleteModal")) closeDeleteModal();
});

document.getElementById("logoutModal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("logoutModal")) hideLogoutModal();
});

document
  .getElementById("validationModal")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("validationModal"))
      closeValidationModal();
  });

document
  .getElementById("addTicketModal")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("addTicketModal"))
      closeAddTicketModal();
  });
document
  .getElementById("editTicketModal")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("editTicketModal"))
      closeEditTicketModal();
  });
document
  .getElementById("cancelTicketModal")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("cancelTicketModal"))
      closeCancelTicketModal();
  });

// ============ INITIALIZE ============
document.addEventListener("DOMContentLoaded", () => {
  saveMovies();
  renderTable();

  const addModal = document.getElementById("addModal");
  const editModal = document.getElementById("editModal");
  ["input", "change"].forEach((evt) => {
    addModal.addEventListener(evt, onFormInputMaybeClearError);
    editModal.addEventListener(evt, onFormInputMaybeClearError);
  });

  const ticketSearchInputElement = document.getElementById("ticketSearchInput");
  if (ticketSearchInputElement) {
    ticketSearchInputElement.addEventListener("input", function () {
      searchTickets(this.value);
    });
  }

  const addTicketModal = document.getElementById("addTicketModal");
  if (addTicketModal) {
    ["input", "change"].forEach((eventName) => {
      addTicketModal.addEventListener(eventName, onTicketAddInputMaybeClearError);
    });
  }
});

// Chống lại BF Cache (Back-Forward Cache) của trình duyệt
window.addEventListener("pageshow", function (event) {
  // event.persisted = true nghĩa là trang được lôi ra từ bộ nhớ đệm (khi ấn Back)
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    // Ép trình duyệt phải tải lại trang hoàn toàn
    window.location.reload();
  }
});

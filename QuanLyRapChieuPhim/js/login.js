const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const togglePasswordButton = document.getElementById("toggle-password-btn");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

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

function isEmailValid(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isPasswordValid(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
}

function setError(fieldName, message) {
  if (fieldName === "email") {
    emailError.textContent = message;
    emailInput.classList.add("input-error");
  }

  if (fieldName === "password") {
    passwordError.textContent = message;
    passwordInput.classList.add("input-error");
  }
}

function showSuccessToast(title, message) {
  showToast(title, message, "success");
}

function setupPasswordToggle() {
  if (!togglePasswordButton || !passwordInput) return;

  togglePasswordButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordButton.style.opacity = isHidden ? "1" : "0.7";
  });
}

function handleLogin() {
  clearErrors();

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  let hasError = false;

  // Validate email
  if (emailValue === "") {
    setError("email", "Vui lòng nhập email.");
    hasError = true;
  } else if (!isEmailValid(emailValue)) {
    setError("email", "Email không hợp lệ.");
    hasError = true;
  }

  // Validate password
  if (passwordValue === "") {
    setError("password", "Vui lòng nhập mật khẩu.");
    hasError = true;
  } else if (passwordValue.length < 8) {
    setError("password", "Mật khẩu phải có ít nhất 8 ký tự.");
    hasError = true;
  } else if (!isPasswordValid(passwordValue)) {
    setError("password", "Mật khẩu cần có chữ hoa, chữ thường và số.");
    hasError = true;
  }

  // Hiện hết lỗi rồi mới dừng
  if (hasError) return;

  const userList = JSON.parse(localStorage.getItem("users")) || [];
  let matchedUser = null;

  for (let i = 0; i < userList.length; i += 1) {
    const oneUser = userList[i];
    if (oneUser.email === emailValue && oneUser.password === passwordValue) {
      matchedUser = oneUser;
      break;
    }
  }

  if (!matchedUser) {
    setError("email", "Email hoặc mật khẩu không chính xác.");
    setError("password", "Email hoặc mật khẩu không chính xác.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(matchedUser));
  showSuccessToast("Đăng nhập thành công", "Đang chuyển hướng...");

  const isAdminUser =
    matchedUser.role === "admin" ||
    matchedUser.isAdmin === true ||
    matchedUser.email === "admin@rikkei.edu.vn";

  setTimeout(() => {
    if (isAdminUser) {
      window.location.href = "admin.html";
      return;
    }

    window.location.href = "index.html";
  }, 1200);
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  handleLogin();
});

setupPasswordToggle();
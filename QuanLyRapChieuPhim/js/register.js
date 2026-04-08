const registerForm = document.getElementById("register-form");
const fullNameInput = document.getElementById("fullname-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const termsCheckbox = document.getElementById("terms-checkbox");
const togglePasswordButtons = document.querySelectorAll(".toggle-password-btn");

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

const fullNameError = document.getElementById("fullname-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const termsError = document.getElementById("terms-error");

/* ---------- seed data ---------- */
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    {
      id: 1,
      fullName: "Admin Chính",
      email: "LQTuan@rikkei.edu.vn",
      password: "Admin123456",
      role: "admin",
      createdAt: "2026-03-03T12:26:21.617Z",
      isActive: true
    },
    {
      id: 2,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      password: "MatKhau123",
      role: "user",
      createdAt: "2026-03-01T12:26:21.617Z",
      isActive: true
    }
  ];

  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

/* ---------- helpers ---------- */
function clearErrors() {
  fullNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  termsError.textContent = "";

  fullNameInput.classList.remove("input-error");
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
  confirmPasswordInput.classList.remove("input-error");
}

function setError(field, message) {
  if (field === "fullName") {
    fullNameError.textContent = message;
    fullNameInput.classList.add("input-error");
  }

  if (field === "email") {
    emailError.textContent = message;
    emailInput.classList.add("input-error");
  }

  if (field === "password") {
    passwordError.textContent = message;
    passwordInput.classList.add("input-error");
  }

  if (field === "confirmPassword") {
    confirmPasswordError.textContent = message;
    confirmPasswordInput.classList.add("input-error");
  }

  if (field === "terms") {
    termsError.textContent = message;
  }
}

function isEmailValid(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isPasswordValid(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function emailExists(email) {
  const users = getUsers();
  const lowerEmail = email.toLowerCase();

  for (let i = 0; i < users.length; i += 1) {
    if ((users[i].email || "").toLowerCase() === lowerEmail) {
      return true;
    }
  }

  return false;
}

function getNextUserId(users) {
  let maxId = 0;

  for (let i = 0; i < users.length; i += 1) {
    if (users[i].id > maxId) {
      maxId = users[i].id;
    }
  }

  return maxId + 1;
}

function showSuccessToast(title, message) {
  showToast(title, message, "success");
}

/* ---------- password toggle ---------- */
togglePasswordButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const targetInput = index === 0 ? passwordInput : confirmPasswordInput;

    if (targetInput.type === "password") {
      targetInput.type = "text";
      button.style.opacity = "1";
    } else {
      targetInput.type = "password";
      button.style.opacity = "0.7";
    }
  });
});

/* ---------- main register ---------- */
function handleRegister() {
  clearErrors();

  const fullNameValue = fullNameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const confirmPasswordValue = confirmPasswordInput.value.trim();

  let hasError = false;

  // Full name
  if (fullNameValue === "") {
    setError("fullName", "Vui lòng nhập họ và tên.");
    hasError = true;
  }

  // Email
  if (emailValue === "") {
    setError("email", "Vui lòng nhập email.");
    hasError = true;
  } else if (!isEmailValid(emailValue)) {
    setError("email", "Email không hợp lệ.");
    hasError = true;
  } else if (emailExists(emailValue)) {
    setError("email", "Email này đã được đăng ký.");
    hasError = true;
  }

  // Password
  if (passwordValue === "") {
    setError("password", "Vui lòng nhập mật khẩu.");
    hasError = true;
  } else if (!isPasswordValid(passwordValue)) {
    setError("password", "Mật khẩu cần >= 8 ký tự, có chữ hoa, chữ thường và số.");
    hasError = true;
  }

  // Confirm password
  if (confirmPasswordValue === "") {
    setError("confirmPassword", "Vui lòng nhập xác nhận mật khẩu.");
    hasError = true;
  } else if (passwordValue !== "" && passwordValue !== confirmPasswordValue) {
    setError("confirmPassword", "Mật khẩu xác nhận không khớp.");
    hasError = true;
  }

  // Terms
  if (!termsCheckbox.checked) {
    setError("terms", "Bạn cần đồng ý điều khoản trước khi đăng ký.");
    hasError = true;
  }

  // Nếu có lỗi thì dừng
  if (hasError) {
    return;
  }

  // Không lỗi => lưu user
  const users = getUsers();

  const newUser = {
    id: getNextUserId(users),
    fullName: fullNameValue,
    email: emailValue,
    password: passwordValue,
    role: "user",
    createdAt: new Date().toISOString(),
    isActive: true
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showSuccessToast("Đăng ký thành công", "Đang chuyển sang trang đăng nhập...");

  setTimeout(() => {
    window.location.href = "./login.html";
  }, 1200);
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleRegister();
});
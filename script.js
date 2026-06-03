const VALID_USERNAME = "2025300339";
const VALID_PASSWORD = "lola31leo";
const VALID_NAME = "Julia D. Ampon";
const SESSION_KEY = "sanbeda-static-user";

function getCurrentPage() {
  return document.body.dataset.page || "";
}

function getSessionUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function setSessionUser() {
  const user = {
    username: VALID_USERNAME,
    name: VALID_NAME
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function requireAuth() {
  const user = getSessionUser();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}

function bindSignOut() {
  const signOutBtn = document.getElementById("signOutBtn");
  if (!signOutBtn) {
    return;
  }

  signOutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });
}

function fillIdentity(user) {
  const nameNode = document.getElementById("currentName");
  const userNode = document.getElementById("currentUser");

  if (nameNode) {
    nameNode.textContent = user.name;
  }
  if (userNode) {
    userNode.textContent = user.username;
  }
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatTimestamp(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function setupGradesTimestamp(user) {
  const timestampNode = document.getElementById("gradesTimestamp");
  if (!timestampNode) {
    return;
  }

  timestampNode.textContent = `${user.username}/${formatTimestamp(new Date())}`;
}

function setupLoginPage() {
  const user = getSessionUser();
  if (user) {
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const errorNode = document.getElementById("loginError");

  if (!form || !errorNode) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setSessionUser();
      window.location.href = "dashboard.html";
      return;
    }

    errorNode.textContent = "Incorrect username or password.";
  });
}

function setupResetPage() {
  const form = document.getElementById("resetForm");
  const usernameInput = document.getElementById("resetUsername");
  const topMessage = document.getElementById("resetTopMessage");
  const inlineMessage = document.getElementById("resetInlineMessage");
  const errorNode = document.getElementById("resetError");

  if (!form || !usernameInput || !topMessage || !inlineMessage || !errorNode) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (username === VALID_USERNAME) {
      topMessage.hidden = false;
      inlineMessage.hidden = false;
      errorNode.textContent = "";
      return;
    }

    topMessage.hidden = true;
    inlineMessage.hidden = true;
    errorNode.textContent = "Invalid username.";
  });
}

function setupProtectedPage() {
  const user = requireAuth();
  if (!user) {
    return;
  }

  fillIdentity(user);
  if (getCurrentPage() === "grades") {
    setupGradesTimestamp(user);
  }
  bindSignOut();
}

(function init() {
  const page = getCurrentPage();

  if (page === "login") {
    setupLoginPage();
    return;
  }

  if (page === "reset") {
    setupResetPage();
    return;
  }

  if (page === "dashboard" || page === "grades") {
    setupProtectedPage();
  }
})();

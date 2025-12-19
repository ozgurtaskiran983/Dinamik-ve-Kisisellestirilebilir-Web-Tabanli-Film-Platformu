// Kullanıcının giriş durumunu kontrol eder
const user = localStorage.getItem("loggedInUser");

// Navigasyon çubuğunu oluşturur
const navBar = document.createElement("nav");
navBar.className = "navbar navbar-expand-lg navbar-dark bg-dark fixed-top";
navBar.style = "padding: 1rem 0;";
navBar.innerHTML = `
  <div class="container">
    <a class="navbar-brand" href="proje.html">🎬 Film Öneri</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="proje.html">Ana Sayfa</a>
        </li>
        ${user ? `
          <li class="nav-item">
            <a class="nav-link" href="favorites.html">❤️ Favorilerim</a>
          </li>
        ` : ''}
      </ul>
      <div class="navbar-nav">
        ${user ? `
          <span class="nav-item nav-link text-light">
            👤 <strong>${user}</strong>
          </span>
          <button onclick="logout()" class="btn btn-outline-light ms-2">Çıkış Yap</button>
        ` : `
          <a class="nav-link" href="login.html">🔐 Giriş</a>
          <a class="nav-link" href="register.html">📝 Kayıt</a>
        `}
      </div>
    </div>
  </div>
`;

// Navigasyon çubuğunu sayfanın en üstüne ekler
document.body.prepend(navBar);

// Navigasyon çubuğunun altında kalan içeriği görünür yapar
document.body.style.paddingTop = "80px";

// Kullanıcı çıkış işlemini gerçekleştirir
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Çıkış yapıldı.");
  window.location.href = "login.html";
}

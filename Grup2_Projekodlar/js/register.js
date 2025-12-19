// Kayıt formunu dinler ve yeni kullanıcı oluşturur
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (localStorage.getItem(`user_${username}`)) {
    alert("Bu kullanıcı adı zaten kullanılıyor!");
    return;
  }
  
  // Kullanıcı bilgilerini ve boş favori listesini kaydeder
  localStorage.setItem(`user_${username}`, JSON.stringify({ 
    password: password, 
    favorites: [] 
  }));
  
  localStorage.setItem("loggedInUser", username);
  alert("Kayıt başarılı!");
  window.location.href = "proje.html";
}); 
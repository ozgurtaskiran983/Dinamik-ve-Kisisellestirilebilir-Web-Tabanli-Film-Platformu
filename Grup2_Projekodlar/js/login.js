// Giriş formunu dinler ve kullanıcı girişini kontrol eder
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const user = JSON.parse(localStorage.getItem(`user_${username}`));
  
  if (!user || user.password !== password) {  // kullanıcı adı veya şifresi hatalı mı diye bakar.
    alert("Kullanıcı adı veya şifre hatalı");
    return;
  }
  
  localStorage.setItem("loggedInUser", username);
  alert("Giriş başarılı!");
  window.location.href = "proje.html";
}); 
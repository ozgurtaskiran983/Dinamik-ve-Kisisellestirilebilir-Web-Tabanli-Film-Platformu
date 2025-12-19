const API_KEY = 'f39f64c811f2c88fa57f8cf7506f1bca';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

$(document).ready(() => { // Sayfa yüklendiğinde çalışır
  checkUserStatus();
  
  const movieId = new URLSearchParams(window.location.search).get('id');
  if (movieId) {
    loadMovieDetail(movieId);
  } else {
    $('#film-detay').html('<div class="alert alert-danger">Film bulunamadı</div>');
  }
});

function checkUserStatus() { // Kullanıcının giriş durumunu kontrol eder
  const user = localStorage.getItem('loggedInUser');
  if (user) {
    $('#loginLink').text('Çıkış Yap').attr('href', '#').on('click', e => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.reload();
    });
    $('#registerLink').hide();
  }
}

async function loadMovieDetail(movieId) { // Film detaylarını getirir
  try {
    const [details, credits] = await Promise.all([
      $.ajax({
        url: `${BASE_URL}/movie/${movieId}`,
        data: { api_key: API_KEY, language: 'tr-TR' }
      }),
      $.ajax({
        url: `${BASE_URL}/movie/${movieId}/credits`,
        data: { api_key: API_KEY, language: 'tr-TR' }
      })
    ]);

    renderDetail(details, credits.cast.slice(0, 6));
  } catch (error) {
    $('#film-detay').html('<div class="alert alert-danger">Film bilgileri yüklenirken bir hata oluştu</div>');
  }
}

function renderDetail(movie, cast) { // Film detaylarını ekrana basar
  const $container = $('#film-detay');
  const $row = $('<div>').addClass('row').appendTo($container);
  
  const $posterCol = $('<div>').addClass('col-md-4 mb-4').appendTo($row);
  $('<img>')
    .addClass('img-fluid rounded')
    .attr('src', `${IMG_BASE}${movie.poster_path}`)
    .attr('alt', movie.title)
    .appendTo($posterCol);

  const $infoCol = $('<div>').addClass('col-md-8').appendTo($row);
  $('<h1>').addClass('mb-4').text(`${movie.title} (${movie.release_date.slice(0, 4)})`).appendTo($infoCol);
  
  const $btnGroup = $('<div>').addClass('mb-4').appendTo($infoCol);
  const $favoriteBtn = $('<button>')
    .addClass('btn btn-primary')
    .text('⭐ Favorilere Ekle')
    .on('click', () => toggleFavorite(movie))
    .appendTo($btnGroup);

  const $infoList = $('<div>').addClass('mb-4').appendTo($infoCol);
  $('<p>').html(`<strong>Türler:</strong> ${movie.genres.map(g => g.name).join(', ')}`).appendTo($infoList);
  $('<p>').html(`<strong>Süre:</strong> ${movie.runtime} dakika`).appendTo($infoList);
  $('<p>').html(`<strong>Puan:</strong> ⭐ ${movie.vote_average}`).appendTo($infoList);
  $('<p>').html(`<strong>Özet:</strong> ${movie.overview}`).appendTo($infoList);
  $('<p>').html(`<strong>Gelir:</strong> $${movie.revenue.toLocaleString()}`).appendTo($infoList);

  const $castSection = $('<div>').addClass('mt-4').appendTo($infoCol);
  $('<h2>').addClass('h4 mb-3').text('Oyuncular').appendTo($castSection);
  const $castList = $('<ul>').addClass('list-group list-group-flush').appendTo($castSection);
  
  cast.forEach(actor => {
    $('<li>')
      .addClass('list-group-item bg-dark text-light')
      .text(`${actor.name} (${actor.character})`)
      .appendTo($castList);
  });

  checkFavoriteStatus(movie.id, $favoriteBtn);
}

function checkFavoriteStatus(movieId, $button) {// Favori durumunu kontrol eder ve butonu günceller
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    $button.prop('disabled', true).text('Favorilere eklemek için giriş yapın');
    return;
  }

  const userData = JSON.parse(localStorage.getItem(`user_${user}`));
  const isFavorite = userData.favorites?.includes(movieId);
  $button.text(isFavorite ? '⭐ Favorilerden Çıkar' : '⭐ Favorilere Ekle');
}

function toggleFavorite(movie) { // Filmi favorilere ekler veya çıkarır
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    alert('Favorilere eklemek için giriş yapmanız gerekiyor!');
    return;
  }

  const userData = JSON.parse(localStorage.getItem(`user_${user}`));
  if (!userData.favorites) userData.favorites = [];

  const index = userData.favorites.indexOf(movie.id);
  if (index === -1) {
    userData.favorites.push(movie.id);
    alert(`${movie.title} favorilere eklendi!`);
  } else {
    userData.favorites.splice(index, 1);
    alert(`${movie.title} favorilerden çıkarıldı!`);
  }

  localStorage.setItem(`user_${user}`, JSON.stringify(userData));
  checkFavoriteStatus(movie.id, $('.btn:contains("⭐")'));
}
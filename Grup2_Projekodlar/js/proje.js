// API ve görsel URL'leri için sabitler
const API_KEY = 'f39f64c811f2c88fa57f8cf7506f1bca';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

$(document).ready(() => {
  checkUserStatus();
  
  // URL'den arama ve tür parametrelerini alır
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('q');
  const genre = params.get('genre');
  
  if (searchTerm) {
    $('#searchInput').val(searchTerm);
  }
  if (genre) {
    $('#genre').val(genre);
  }
  
  loadMovies();
  
  // Arama ve filtreleme olaylarını dinler
  $('#loadMovies').on('click', () => {
    const search = $('#searchInput').val().trim();
    const selectedGenre = $('#genre').val();
    updateURL(search, selectedGenre);
    loadMovies();
  });

  $('#searchInput').on('keyup', e => {
    if (e.key === 'Enter') {
      const search = $('#searchInput').val().trim();
      const selectedGenre = $('#genre').val();
      updateURL(search, selectedGenre);
      loadMovies();
    }
  });

  $('#genre').on('change', () => {
    const search = $('#searchInput').val().trim();
    const selectedGenre = $('#genre').val();
    updateURL(search, selectedGenre);
    loadMovies();
  });
});

// URL'yi arama ve tür parametreleriyle günceller
function updateURL(search, genre) {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (genre) params.set('genre', genre);
  
  const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
  window.history.pushState({}, '', newUrl);
}

// Kullanıcının giriş durumunu kontrol eder
function checkUserStatus() {
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

// API'den filmleri getirir
async function fetchMovies(page = 1, genreId = "") {
  const response = await $.ajax({
    url: `${BASE_URL}/discover/movie`,
    data: {
      api_key: API_KEY,
      language: 'tr-TR',
      sort_by: 'popularity.desc',
      page,
      with_genres: genreId
    }
  });
  return response.results;
}

// Filmleri yükler ve görüntüler
async function loadMovies() {
  const genre = $('#genre').val();
  const searchTerm = $('#searchInput').val().trim();
  const $container = $('#film-listesi');
  $container.empty();

  if (searchTerm) {
    const response = await $.ajax({
      url: `${BASE_URL}/search/movie`,
      data: {
        api_key: API_KEY,
        language: 'tr-TR',
        query: searchTerm
      }
    });
    renderMovies(response.results);
    return;
  }

  let allMovies = [];
  for (let page = 1; page <= 3; page++) {
    const movies = await fetchMovies(page, genre);
    allMovies = allMovies.concat(movies);
  }
  renderMovies(allMovies);
}

// Filmleri kartlar halinde görüntüler
function renderMovies(movies) {
  const $container = $('#film-listesi');
  $container.empty();

  if (!movies?.length) {
    $container.html('<div class="col-12 text-center text-danger">🚫 Hiç film bulunamadı</div>');
    return;
  }

  movies.forEach(movie => {
    const $card = $('<div>').addClass('col').appendTo($container);
    const $cardInner = $('<div>').addClass('card h-100 bg-dark text-light').appendTo($card);
    
    $('<img>')
      .addClass('card-img-top')
      .attr('src', `${IMG_BASE}${movie.poster_path}`)
      .attr('alt', movie.title)
      .appendTo($cardInner);

    const $cardBody = $('<div>').addClass('card-body').appendTo($cardInner);
    $('<h5>').addClass('card-title').text(movie.title).appendTo($cardBody);
    $('<p>').addClass('card-text').html(`⭐ ${movie.vote_average} • 📅 ${movie.release_date?.slice(0, 4)}`).appendTo($cardBody);

    $card.on('click', () => window.location.href = `detail.html?id=${movie.id}`);
  });
}

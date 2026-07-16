// ── Playlist data ─────────────────────────────────────────────────────────────
const songs = [
  { title: "Dreamer",   artist: "Alan Walker",   src: "Songs/Song1.mp3", cover: "Songs/AW logo.webp" },
  { title: "Invincible",     artist: "DEAF KEV",   src: "Songs/Song2.mp3", cover: "Songs/DK cover.webp" },
  { title: "Feel Good",      artist: "Syn Cole",     src: "Songs/Song3.mp3", cover: "Songs/SC cover.jpg" },
  { title: "Ajanite Mone Mone",    artist: "Zubeen Garg, Anindita Paul",   src: "Songs/Song4.mp3", cover: "Songs/ZG cover.jpg" },
  { title: "Janam Janam (Dilwale)",   artist: "Pritam, Arijit Singh, Antara Mitra",  src: "Songs/Song5.mp3", cover: "Songs/JJ cover.webp" },
];

// ── State ──────────────────────────────────────────────────────────────────────
let currentIndex = 0;
let isPlaying    = false;
let isShuffle    = false;
let repeatMode   = 0; // 0 = off, 1 = repeat all, 2 = repeat one

// ── DOM refs ──────────────────────────────────────────────────────────────────
const audio        = document.getElementById("audio");
const albumImg      = document.getElementById("albumImg");
const albumArt      = document.querySelector(".album-art");
const songTitle      = document.getElementById("songTitle");
const songArtist    = document.getElementById("songArtist");
const playBtn        = document.getElementById("playBtn");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const shuffleBtn    = document.getElementById("shuffleBtn");
const repeatBtn      = document.getElementById("repeatBtn");
const progressBar    = document.getElementById("progressBar");
const currentTimeEl  = document.getElementById("currentTime");
const durationEl    = document.getElementById("duration");
const volumeBar      = document.getElementById("volumeBar");
const volIcon        = document.getElementById("volIcon");
const playlistToggle = document.getElementById("playlistToggle");
const playlistEl    = document.getElementById("playlist");

// ── Load song ─────────────────────────────────────────────────────────────────
function loadSong(index) {
  const song = songs[index];
  audio.src        = song.src;
  albumImg.src      = song.cover;
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  highlightActivePlaylistItem();
}

// ── Play / Pause ──────────────────────────────────────────────────────────────
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = "⏸";
  albumArt.classList.add("playing");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "▶";
  albumArt.classList.remove("playing");
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// ── Next / Prev ───────────────────────────────────────────────────────────────
function nextSong() {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// ── Shuffle ───────────────────────────────────────────────────────────────────
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// ── Repeat (off → all → one → off) ───────────────────────────────────────────
repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.classList.toggle("active", repeatMode !== 0);
  repeatBtn.textContent = repeatMode === 2 ? "🔂" : "🔁";
});

// ── Autoplay next song when current ends ─────────────────────────────────────
audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    playSong();
  } else if (repeatMode === 1 || currentIndex < songs.length - 1) {
    nextSong();
  } else {
    pauseSong();
  }
});

// ── Progress bar ──────────────────────────────────────────────────────────────
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    progressBar.style.setProperty("--progress", `${percent}%`);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  const time = (progressBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Volume ────────────────────────────────────────────────────────────────────
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
  volIcon.textContent = audio.volume === 0 ? "🔇" : audio.volume < 0.5 ? "🔉" : "🔊";
});
audio.volume = volumeBar.value / 100; // set initial volume

// ── Playlist UI ───────────────────────────────────────────────────────────────
function renderPlaylist() {
  playlistEl.innerHTML = songs.map((song, idx) => `
    <div class="playlist-item" data-idx="${idx}">
      <img src="${song.cover}" alt="${song.title}" />
      <div class="playlist-item-info">
        <div class="playlist-item-title">${song.title}</div>
        <div class="playlist-item-artist">${song.artist}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".playlist-item").forEach(item => {
    item.addEventListener("click", () => {
      currentIndex = parseInt(item.dataset.idx);
      loadSong(currentIndex);
      playSong();
    });
  });
}

function highlightActivePlaylistItem() {
  document.querySelectorAll(".playlist-item").forEach((item, idx) => {
    item.classList.toggle("playing", idx === currentIndex);
  });
}

playlistToggle.addEventListener("click", () => {
  playlistEl.classList.toggle("open");
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderPlaylist();
loadSong(currentIndex);
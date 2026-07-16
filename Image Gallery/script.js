const images = [
  { id: 1,  src: "Images/Cityrailway.jpg",      title: "City Railway",      category: "city"     },
  { id: 2,  src: "Images/Indiancity.jpg",      title: "Indian City",      category: "city"     },
  { id: 3,  src: "Images/Nightcity.jpg",      title: "Night City",      category: "city"     },
  { id: 4,  src: "Images/Sunsetcity.jpg",      title: "Sunset City",      category: "city"     },
  { id: 5,  src: "Images/Riversidecity.jpg",      title: "Riverside City",      category: "city"     },
  { id: 6,  src: "Images/Flowers.jpg",    title: "Flowers",         category: "nature"   },
  { id: 7,  src: "Images/Forest.jpg",    title: "Forest Tree",    category: "nature"   },
  { id: 8,  src: "Images/Hills.jpg",    title: "Firmlands",    category: "nature"   },
  { id: 9,  src: "Images/Riverside.jpg",    title: "Riverside",    category: "nature"   },
  { id: 10, src: "Images/Rocks.jpg",    title: "Rocks",    category: "nature"   },
  { id: 11, src: "Images/Greenyabstract.jpg",  title: "Green Abstract",  category: "abstract" },
  { id: 12, src: "Images/Squaredabstract.jpg",  title: "Geometry Abstract",  category: "abstract" },
  { id: 13, src: "Images/Rainbowglow.jpg",  title: "Rainbow Glow",  category: "abstract" },
  { id: 14, src: "Images/Rainbowabstract.jpg",  title: "Rainbow & Glass",  category: "abstract" },
  { id: 15, src: "Images/Painting.jpg",  title: "Painting",  category: "abstract" },
  { id: 16, src: "Images/Voyager.jpg",     title: "Voyager 1",     category: "space"    },
  { id: 17, src: "Images/Satellite.jpg",     title: "Satellite",     category: "space"    },
  { id: 18, src: "Images/Galaxy.jpg",     title: "Galaxy",     category: "space"    },
  { id: 19, src: "Images/Blackhole.jpg",     title: "Blackhole",     category: "space"    },
  { id: 20, src: "Images/Earth&moon.jpg",     title: "Earth & Moon",     category: "space"    },
];

let currentFilter = "all", currentSearch = "", lightboxIndex = 0, filteredImages = [];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbCounter = document.getElementById("lbCounter");

function getFiltered() {
  return images.filter(img => {
    const matchCat = currentFilter === "all" || img.category === currentFilter;
    const q = currentSearch.toLowerCase();
    const matchQ = !q || img.title.toLowerCase().includes(q) || img.category.includes(q);
    return matchCat && matchQ;
  });
}

function render() {
  filteredImages = getFiltered();
  gallery.innerHTML = filteredImages.length === 0
    ? `<div class="empty-state">No images found.</div>`
    : filteredImages.map((img, idx) => `
        <div class="gallery-item" onclick="openLightbox(${idx})">
          <img src="${img.src}" alt="${img.title}" loading="lazy" />
          <span class="card-badge">${img.category}</span>
          <div class="card-overlay">
            <div class="card-title">${img.title}</div>
            <div class="card-cat">${img.category}</div>
          </div>
        </div>
      `).join("");
}

function openLightbox(idx) {
  lightboxIndex = idx;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const img = filteredImages[lightboxIndex];
  lbImg.style.opacity = "0";
  setTimeout(() => {
    lbImg.src = img.src;
    lbImg.alt = img.title;
    lbTitle.textContent = img.title;
    lbCounter.textContent = `${lightboxIndex + 1} / ${filteredImages.length}`;
    lbImg.style.opacity = "1";
  }, 150);
}

function prevImage() {
  lightboxIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
  updateLightbox();
}

function nextImage() {
  lightboxIndex = (lightboxIndex + 1) % filteredImages.length;
  updateLightbox();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", prevImage);
document.getElementById("lbNext").addEventListener("click", nextImage);

lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "Escape") closeLightbox();
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

let searchTimer;
document.getElementById("searchInput").addEventListener("input", e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { currentSearch = e.target.value.trim(); render(); }, 250);
});

let touchStartX = 0;
lightbox.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? nextImage() : prevImage();
});

render();

// ── Dark/Light Mode Toggle ────────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "dark";

if (savedTheme === "light") document.body.classList.add("light-mode");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.querySelector(".theme-icon").textContent = isLight ? "☀️" : "🌙";
});

// Set initial icon
themeToggle.querySelector(".theme-icon").textContent = savedTheme === "light" ? "☀️" : "🌙";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import Zoom from 'ol/control/Zoom';

export default class SetupPagePresenter {
  constructor() {
    this.currentStep = 0;
    this.titles = [
      `Let’s <span style="color:#A9E652">get</span> your <strong>set up first!</strong>`,
      `Set Up`,
      `You’re <span style="color:#A9E652">ready</span> to go!`,
    ];
    this.descriptions = [
      "Just a few steps to create your AgriEdu account and start exploring smarter farming tools and learning resources.",
      "Please complete all the required fields to begin",
      "Your account is all set. Let's grow smarter, together!",
    ];
    this.icons = [
  `<img src="logo/setap.gif" alt="Plant" style="width: 80%; height: 80%;" />`,
  "",
  "✅"
];

    this.map = null;
    this.marker = null;
  }

  init() {
    this.titleEl = document.getElementById("step-title");
    this.descEl = document.getElementById("step-desc");
    this.iconEl = document.getElementById("step-icon");
    this.dots = document.querySelectorAll(".dot");
    this.nextBtn = document.getElementById("next-btn");
    this.formStepEl = document.getElementById("form-step");

    this.nextBtn.addEventListener("click", () => this.nextStep());

    this.updateStep();

    // Init peta dan form hanya sekali saat init
    this._initMap();
    this._initForm();
  }

  nextStep() {
    if (this.currentStep < this.titles.length - 1) {
      this.currentStep++;
      this.updateStep();
    } else {
      alert("Setup selesai!");
      // window.location.href = '/home'; // redirect kalau perlu
    }
  }

updateStep() {
  this.titleEl.innerHTML = this.titles[this.currentStep];
  this.descEl.textContent = this.descriptions[this.currentStep];
  this.iconEl.innerHTML = this.icons[this.currentStep];

  this.dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === this.currentStep);
  });

if (this.currentStep === 1) {
  this.formStepEl.style.display = 'block';

  // this.descEl.style.display = 'none'; ← HAPUS baris ini kalau ingin tetap tampil
  this.nextBtn.style.display = 'none';
} else {
  this.formStepEl.style.display = 'none';
  this.descEl.style.display = 'block';
  this.nextBtn.style.display = 'inline-block';
}
const leftIllustration = document.getElementById('left-illustration');

if (this.currentStep === 0) {
  leftIllustration.style.display = 'flex';
} else {
  leftIllustration.style.display = 'none';
}


}


_initMap() {
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([117.0, -1.5]), // default
      zoom: 5,
    }),
    controls: [new Zoom()]
  });

// Ganti bagian pembuatan markerElement dengan ini
const markerElement = document.createElement('img');
markerElement.src = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
markerElement.style.width = '32px';  // ukuran marker, bisa disesuaikan
markerElement.style.height = '32px';
markerElement.style.transform = 'translate(-50%, -100%)'; // biar titik bawah marker tepat di posisi koordinat
markerElement.style.position = 'absolute';
markerElement.style.cursor = 'grab';


  this.marker = new Overlay({
    element: markerElement,
    positioning: 'center-center',
    stopEvent: false, // supaya event mouse bisa ditangkap
  });

  this.map.addOverlay(this.marker);

  // Fungsi update posisi marker dan input lat/lon
  const updatePosition = (coordinate) => {
    this.marker.setPosition(coordinate);
    const [lon, lat] = toLonLat(coordinate);
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
  };

  // Coba dapat lokasi perangkat
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const coords = fromLonLat([longitude, latitude]);

      // Animasi pindah ke lokasi pengguna
      this.map.getView().animate({
        center: coords,
        zoom: 12,
        duration: 3000,  // durasi animasi dalam ms (1.5 detik)
      });

      updatePosition(coords);
    },
    () => {
      // fallback jika gagal dapat lokasi
      const defaultCoords = fromLonLat([117.0, -1.5]);
      this.map.getView().setCenter(defaultCoords);
      updatePosition(defaultCoords);
    }
  );
} else {
  const defaultCoords = fromLonLat([117.0, -1.5]);
  this.map.getView().setCenter(defaultCoords);
  updatePosition(defaultCoords);
}

  let dragging = false;

  markerElement.addEventListener('mousedown', (evt) => {
    evt.preventDefault();
    dragging = true;
    markerElement.style.cursor = 'grabbing';
  });

  this.map.on('pointermove', (evt) => {
    if (dragging) {
      updatePosition(evt.coordinate);
    }
  });

  window.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      markerElement.style.cursor = 'grab';
    }
  });

  this.map.on('click', (evt) => {
    if (!dragging) {
      updatePosition(evt.coordinate);
    }
  });
}

  _initForm() {
  const form = document.getElementById('setup-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const interest = document.getElementById('interest').value;
    const experience = form.experience.value;
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;

    // Contoh validasi sederhana
    if (!name || !interest || !experience || !lat || !lon) {
      alert('Please fill all fields.');
      return;
    }

    // Jika submit berhasil, lanjut ke step berikutnya
    console.log({ name, interest, experience, lat, lon });
    alert('Setup complete!');

    // Pindah step berikutnya
    this.nextStep();
  });
}

}

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import CONFIG from "../../config";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";
import Zoom from "ol/control/Zoom";
import SetupModel from "./SetupPage-Model";
import { saveSetupData, markSetupCompleted } from "../../utils/indexeddb";
import authService from "../../data/auth-service";

export default class SetupPagePresenter {
  constructor() {
    this.currentStep = 0;
    this.titles = [
      `Let's <span style="color:#A9E652">get</span> your <strong>set up first!</strong>`,
      `Set Up`,
      `You're <span style="color:#A9E652">ready</span> to go!`,
    ];
    this.descriptions = [
      "Just a few steps to create your AgriEdu account and start exploring smarter farming tools and learning resources.",
      "Please complete all the required fields to begin",
      "Your account is all set. Let's grow smarter, together!",
    ];
    this.icons = [
      `<img src="logo/setap.gif" alt="Plant" style="width: 80%; height: 80%;" />`,
      "",
      `<img src="logo/finishsetup.gif" alt="Plant" style="width: 80%; height: 80%;" />`,
    ];

    this.map = null;
    this.marker = null;
  }

  async init() {
    const userData = authService.getUserData();
    if (!userData || !userData.id) {
      console.warn("No user data found, redirecting to login");
      window.location.hash = "#/login";
      return;
    }

    const hasCompleted = await this.checkSetupStatus(userData.id);
    if (hasCompleted) {
      window.location.hash = "#/home";
      return;
    }

    this.titleEl = document.getElementById("step-title");
    this.descEl = document.getElementById("step-desc");
    this.iconEl = document.getElementById("step-icon");
    this.dots = document.querySelectorAll(".dot");
    this.nextBtn = document.getElementById("next-btn");
    this.formStepEl = document.getElementById("form-step");

    this.nextBtn.addEventListener("click", () => this.nextStep());

    this.updateStep();

    this._initMap();
    this._initForm();
  }

  async checkSetupStatus(userId) {
    try {
      const { hasCompletedSetup } = await import("../../utils/indexeddb");
      const isCompleted = await hasCompletedSetup(userId);
      return isCompleted;
    } catch (error) {
      console.error("Error checking setup status:", error);
      return false;
    }
  }

  async nextStep() {
    if (this.currentStep < this.titles.length - 1) {
      this.currentStep++;
      this.updateStep();
    } else {
      const userData = authService.getUserData();
      if (userData && userData.id) {
        try {
          await markSetupCompleted(userData.id);
        } catch (error) {
          console.error("Error marking setup as completed:", error);
        }
      }

      Swal.fire({
        icon: "success",
        title: "Setup selesai!",
        text: "Selamat! Setup akun Anda telah berhasil diselesaikan.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        window.location.hash = "#/home";
      });
    }
  }

  updateStep() {
    this.titleEl.innerHTML = this.titles[this.currentStep];
    this.descEl.textContent = this.descriptions[this.currentStep];
    this.iconEl.innerHTML = this.icons[this.currentStep];

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentStep);
    });

    if (this.currentStep === 1) {
      this.formStepEl.style.display = "block";

      this.nextBtn.style.display = "none";
    } else {
      this.formStepEl.style.display = "none";
      this.descEl.style.display = "block";
      this.nextBtn.style.display = "inline-block";
    }
  }

  async _initMap() {
    const mapElement = document.getElementById("map");
    const popupElement = document.getElementById("popup");
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");

    this.map = new Map({
      target: mapElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([117.0, -1.5]),
        zoom: 5,
      }),
      controls: [new Zoom()],
    });

    const markerElement = document.createElement("img");
    markerElement.src = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    markerElement.style.width = "32px";
    markerElement.style.height = "32px";
    markerElement.style.transform = "translate(-50%, -100%)";
    markerElement.style.position = "absolute";
    markerElement.style.cursor = "grab";

    this.marker = new Overlay({
      element: markerElement,
      positioning: "center-center",
      stopEvent: false,
    });

    this.map.addOverlay(this.marker);

    this.popupOverlay = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -40],
    });
    this.map.addOverlay(this.popupOverlay);

    const updatePosition = async (coordinate) => {
      this.marker.setPosition(coordinate);
      const [lon, lat] = toLonLat(coordinate);

      latInput.value = lat;
      lonInput.value = lon;

      const placeName = await SetupModel.getPlaceName(lat, lon);
      const truncatedName =
        placeName.length > 80 ? placeName.slice(0, 80) + "..." : placeName;
      popupElement.innerHTML = truncatedName;
      popupElement.title = placeName;
      this.popupOverlay.setPosition(coordinate);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = fromLonLat([longitude, latitude]);

          this.map.getView().animate({
            center: coords,
            zoom: 12,
            duration: 3000,
          });

          await updatePosition(coords);
        },
        async () => {
          const defaultCoords = fromLonLat([117.0, -1.5]);
          this.map.getView().setCenter(defaultCoords);
          await updatePosition(defaultCoords);
        }
      );
    } else {
      const defaultCoords = fromLonLat([117.0, -1.5]);
      this.map.getView().setCenter(defaultCoords);
      await updatePosition(defaultCoords);
    }

    let dragging = false;

    markerElement.addEventListener("mousedown", (evt) => {
      evt.preventDefault();
      dragging = true;
      markerElement.style.cursor = "grabbing";
    });

    this.map.on("pointermove", async (evt) => {
      if (dragging) {
        await updatePosition(evt.coordinate);
      }
    });

    window.addEventListener("mouseup", () => {
      if (dragging) {
        dragging = false;
        markerElement.style.cursor = "grab";
      }
    });

    this.map.on("click", async (evt) => {
      if (!dragging) {
        await updatePosition(evt.coordinate);
      }
    });
  }

  _initForm() {
    const form = document.getElementById("setup-form");
    if (!form) {
      console.error("Setup form not found");
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value?.trim();
      const interest = document.getElementById("interest")?.value?.trim();
      const experience = form.experience?.value?.trim();
      const lat = document.getElementById("lat")?.value?.trim();
      const lon = document.getElementById("lon")?.value?.trim();

      if (!name || !interest || !experience || !lat || !lon) {
        Swal.fire({
          icon: "warning",
          title: "Form Tidak Lengkap",
          text: "Mohon lengkapi semua field yang diperlukan.",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        const token = authService.getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.AUTH.GET_USER}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        const user = userData.data || userData.user || userData;
        if (!user || !user.id) {
          console.error("Invalid user data structure:", userData);
          throw new Error("Invalid user data received from API");
        }

        const dataToSave = {
          userId: user.id,
          name,
          interest,
          experience,
          lat,
          lon,
          completedAt: new Date().toISOString(),
        };

        await saveSetupData(dataToSave);

        await markSetupCompleted(user.id);

        Swal.fire({
          icon: "success",
          title: "Setup Berhasil!",
          text: "Data setup telah berhasil disimpan.",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          this.nextStep();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menyimpan data: " + (error.message || "Unknown error"),
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    });
  }
}

import ProfilePresenter from "./profile-presenter";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class ProfilePage {
  constructor() {
    this.pendingProfilePicture = null;
    this.hasUnsavedChanges = false;
  }

  async render() {
    const authService = (await import("../../data/auth-service.js")).default;
    const userData = authService.getUserData();

    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = NavigationBar.getInstance({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });

    return `
      <div class="profile-page-container">
        ${navbar.render()}

        <div class="profile-container">
          <aside class="profile-sidebar">
            <div class="sidebar-avatar">
              <img src="images/avatar.jpg" alt="Avatar" class="avatar" id="sidebarAvatar"/>
              <p id="sidebarUsername">Username User</p>
              <p id="sidebarExperience">Experience Level</p>
              <button class="sidebar-button">Profile Pengguna</button>
            </div>
          </aside>

          <main>
            <section class="container-profile">
              <h1>Profile Pengguna</h1>
              <hr />
              <div class="profile-avatar-wrapper">
                <div class="avatar-left">
                  <img src="images/avatar.jpg" alt="Avatar" id="avatarPreview" class="avatar"/>
                </div>
                <div class="edit-right">
                  <button id="editAvatarBtn">Edit Photo</button>
                  <p class="avatar-note">Format harus berupa gambar. Tidak boleh lebih dari 2MB.</p>
                </div>
              </div>

              <div class="profile-info">
                <div class="input-group">
                  <label for="fullNameInput">Nama Lengkap:</label>
                  <input type="text" id="fullNameInput" placeholder="Enter your full name" />
                </div>

                <div class="input-group">
                  <label for="usernameInput">Username:</label>
                  <input type="text" id="usernameInput" placeholder="Enter your username" />
                </div>
              </div>

              <div class="profile-experience">
                <label>Select your farming experience level:</label>
                <div class="experience-options">
                  <label><input type="radio" name="experience" value="Beginner" /> Beginner</label>
                  <label><input type="radio" name="experience" value="Intermediate" /> Intermediate</label>
                  <label><input type="radio" name="experience" value="Experienced" /> Experienced</label>
                </div>
              </div>

              <input type="file" id="avatarInput" accept="image/*" capture="environment" style="display:none"/>

              <div class="profile-save-btn-wrapper" style="margin-top: 20px;">
                <button id="saveProfileBtn" class="btn btn-primary">Edit Profile</button>
                <div id="unsavedChangesIndicator" style="display: none; margin-top: 10px; color: #ff6b35; font-size: 14px;">
                  <i>⚠️ You have unsaved changes</i>
                </div>
              </div>
            </section>
          </main>
        </div>

        <footer class="profile-footer">
          <p>&copy; 2025 AgriEdu. All rights reserved.</p>
        </footer>
      </div>
    `;
  }

  async afterRender() {
    this.setupNavigationEvents();

    const editBtn = document.getElementById("editAvatarBtn");
    const avatarInput = document.getElementById("avatarInput");
    const avatarPreview = document.getElementById("avatarPreview");

    if (editBtn && avatarInput && avatarPreview) {
      editBtn.addEventListener("click", () => {
        avatarInput.click();
      });

      avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
              icon: "warning",
              title: "File Terlalu Besar",
              text: "Ukuran file maksimal 2MB. Silakan pilih file yang lebih kecil.",
              showConfirmButton: true,
              confirmButtonText: "OK",
            });
            avatarInput.value = "";
            return;
          }

          if (!file.type.startsWith("image/")) {
            Swal.fire({
              icon: "warning",
              title: "Format File Tidak Valid",
              text: "File harus berupa gambar (JPG, PNG, GIF, dll).",
              showConfirmButton: true,
              confirmButtonText: "OK",
            });
            avatarInput.value = "";
            return;
          }

          this.pendingProfilePicture = file;

          this.showImagePreview(file);

          this.markAsUnsaved();
        }
      });
    }

    this.setupFormChangeTracking();

    ProfilePresenter.init(this);
  }

  async setupNavigationEvents() {}

  setupFormChangeTracking() {
    const formInputs = [
      document.getElementById("fullNameInput"),
      document.getElementById("usernameInput"),
      ...document.querySelectorAll('input[name="experience"]'),
    ];

    formInputs.forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          if (!this.hasUnsavedChanges && !this.pendingProfilePicture) {
            this.markAsUnsaved();
          }
        });

        input.addEventListener("change", () => {
          if (!this.hasUnsavedChanges && !this.pendingProfilePicture) {
            this.markAsUnsaved();
          }
        });
      }
    });
  }

  async showProfile({ fullName, username, experience }) {
    const fullNameInput = document.getElementById("fullNameInput");
    const usernameInput = document.getElementById("usernameInput");

    if (fullNameInput) fullNameInput.value = fullName || "";
    if (usernameInput) usernameInput.value = username || "";

    if (experience) {
      const radio = document.querySelector(
        `input[name="experience"][value="${experience}"]`
      );
      if (radio) radio.checked = true;
    }

    const profilePictureService = (
      await import("../../data/profile-picture-service.js")
    ).default;

    const authService = (await import("../../data/auth-service.js")).default;
    const userData = authService.getUserData();

    const avatarPreview = document.getElementById("avatarPreview");
    if (avatarPreview) {
      await profilePictureService.updateImageElement(
        avatarPreview,
        userData?.profilePictureUrl,
        username
      );
    }

    const sidebarAvatar = document.getElementById("sidebarAvatar");
    if (sidebarAvatar) {
      await profilePictureService.updateImageElement(
        sidebarAvatar,
        userData?.profilePictureUrl,
        username
      );
    }

    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarExperience = document.getElementById("sidebarExperience");

    if (sidebarUsername)
      sidebarUsername.textContent = username || "Username User";
    if (sidebarExperience)
      sidebarExperience.textContent = experience || "Experience Level";
  }

  showImagePreview(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageDataUrl = e.target.result;

      const existingFallbacks = document.querySelectorAll(".fallback-avatar");
      existingFallbacks.forEach((fallback) => fallback.remove());

      const avatarPreview = document.getElementById("avatarPreview");
      if (avatarPreview) {
        avatarPreview.src = imageDataUrl;
        avatarPreview.style.display = "block";
        avatarPreview.alt = "Profile Picture Preview";
      }

      const sidebarAvatar = document.getElementById("sidebarAvatar");
      if (sidebarAvatar) {
        sidebarAvatar.src = imageDataUrl;
        sidebarAvatar.style.display = "block";
        sidebarAvatar.alt = "Profile Picture Preview";
      }
    };

    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal membaca file gambar yang dipilih.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    };

    reader.readAsDataURL(file);
  }

  markAsUnsaved() {
    this.hasUnsavedChanges = true;

    const indicator = document.getElementById("unsavedChangesIndicator");
    if (indicator) {
      indicator.style.display = "block";
    }

    const saveBtn = document.getElementById("saveProfileBtn");
    if (saveBtn) {
      if (this.pendingProfilePicture) {
        saveBtn.textContent = "Save Profile & Upload Picture";
      } else {
        saveBtn.textContent = "Save Changes";
      }
    }
  }

  markAsSaved() {
    this.hasUnsavedChanges = false;
    this.pendingProfilePicture = null;

    const avatarInput = document.getElementById("avatarInput");
    if (avatarInput) {
      avatarInput.value = "";
    }

    const indicator = document.getElementById("unsavedChangesIndicator");
    if (indicator) {
      indicator.style.display = "none";
    }

    const saveBtn = document.getElementById("saveProfileBtn");
    if (saveBtn) {
      saveBtn.textContent = "Edit Profile";
    }
  }

  getPendingProfilePicture() {
    return this.pendingProfilePicture;
  }

  hasUnsavedProfileChanges() {
    return this.hasUnsavedChanges;
  }
}

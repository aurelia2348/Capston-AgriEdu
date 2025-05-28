import ProfilePresenter from "./profile-presenter";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class ProfilePage {
  async render() {
    // Get user initial from localStorage
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
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
              </div>
            </section>
          </main>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Set up navigation bar events
    this.setupNavigationEvents();

    // Set up avatar upload functionality
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
          const reader = new FileReader();
          reader.onload = function (e) {
            avatarPreview.src = e.target.result;
            // Also update sidebar avatar
            const sidebarAvatar = document.getElementById("sidebarAvatar");
            if (sidebarAvatar) {
              sidebarAvatar.src = e.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Initialize ProfilePresenter
    ProfilePresenter.init(this);
  }

  setupNavigationEvents() {
    // Set up navigation bar events using the NavigationBar component's centralized event handling
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    // Use the NavigationBar's built-in event binding
    navbar.bindEvents();
  }

  showProfile({ avatar, fullName, username, experience }) {
    // Update main profile form
    const fullNameInput = document.getElementById("fullNameInput");
    const usernameInput = document.getElementById("usernameInput");

    if (fullNameInput) fullNameInput.value = fullName || "";
    if (usernameInput) usernameInput.value = username || "";

    // Update experience radio buttons
    if (experience) {
      const radio = document.querySelector(
        `input[name="experience"][value="${experience}"]`
      );
      if (radio) radio.checked = true;
    }

    // Update avatar images
    if (avatar) {
      const avatarPreview = document.getElementById("avatarPreview");
      if (avatarPreview) avatarPreview.src = avatar;

      const sidebarAvatar = document.getElementById("sidebarAvatar");
      if (sidebarAvatar) sidebarAvatar.src = avatar;
    }

    // Update sidebar information
    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarExperience = document.getElementById("sidebarExperience");

    if (sidebarUsername)
      sidebarUsername.textContent = username || "Username User";
    if (sidebarExperience)
      sidebarExperience.textContent = experience || "Experience Level";
  }
}

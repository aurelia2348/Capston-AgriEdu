import ProfileModel from "./profile-model";
import authService from "../../data/auth-service";

const ProfilePresenter = {
  async init(view) {
    this.view = view;

    try {
      await authService.getCurrentUser();
    } catch (error) {
      // Failed to update user data
    }

    const profile = await ProfileModel.getUserProfile();
    await view.showProfile(profile);

    this._setupEventListeners();
  },

  _setupEventListeners() {
    const saveBtn = document.getElementById("saveProfileBtn");
    if (!saveBtn) {
      console.error("Tombol simpan tidak ditemukan di DOM!");
      return;
    }
    saveBtn.addEventListener("click", () => this._handleSaveProfile());
  },

  async _handleSaveProfile() {
    const fullName = document.getElementById("fullNameInput").value.trim();
    const username = document.getElementById("usernameInput").value.trim();
    const experienceRadios = document.querySelectorAll(
      'input[name="experience"]'
    );
    let experience = "";
    experienceRadios.forEach((radio) => {
      if (radio.checked) experience = radio.value;
    });

    const pendingProfilePicture = this.view.getPendingProfilePicture();

    const saveBtn = document.getElementById("saveProfileBtn");
    const originalBtnText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = pendingProfilePicture
      ? "Saving Profile & Uploading Picture..."
      : "Saving Profile...";

    try {
      await ProfileModel.updateUsername(username);

      await ProfileModel.saveSetupData({ name: fullName, experience });

      if (pendingProfilePicture) {
        const updatedUserData = await ProfileModel.uploadProfilePicture(
          pendingProfilePicture
        );

        try {
          await authService.getCurrentUser();
        } catch (error) {
          // Failed to refresh user data
        }

        const profile = await ProfileModel.getUserProfile();
        await this.view.showProfile(profile);

        this.updateNavigationBarProfilePicture();
      }

      this.view.markAsSaved();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: pendingProfilePicture
          ? "Profil dan foto profil berhasil disimpan!"
          : "Profil berhasil disimpan!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menyimpan profil: " + error.message,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalBtnText;
    }
  },

  updateNavigationBarProfilePicture() {
    try {
      const userData = authService.getUserData();

      const profileContainers = document.querySelectorAll(
        ".app-profile-icon-container"
      );

      if (profileContainers.length > 0) {
        import("../../components/NavigationBar.js").then(
          ({ NavigationBar }) => {
            const navbar = NavigationBar.getInstance({
              currentPath: window.location.hash.slice(1),
              userInitial: (userData?.username || "User")
                .charAt(0)
                .toUpperCase(),
              username: userData?.username || "User",
              profilePictureUrl: userData?.profilePictureUrl,
              showProfile: true,
            });

            navbar.updateProfilePicture(
              userData?.profilePictureUrl,
              userData?.username
            );
          }
        );
      }
    } catch (error) {
      console.error("Error updating navigation bar profile picture:", error);
    }
  },
};

export default ProfilePresenter;

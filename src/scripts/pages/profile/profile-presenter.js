import ProfileModel from "./profile-model";
import authService from "../../data/auth-service";

const ProfilePresenter = {
  async init(view) {
    this.view = view;

    try {
      // Refresh user data from API to get latest profile picture
      await authService.getCurrentUser();
    } catch (error) {
      console.warn("Gagal update user data dari API:", error);
    }

    const profile = await ProfileModel.getUserProfile();
    await view.showProfile(profile);

    this._setupEventListeners();
  },

  _setupEventListeners() {
    const saveBtn = document.getElementById("saveProfileBtn");
    console.log("saveBtn:", saveBtn);
    if (!saveBtn) {
      console.error("Tombol simpan tidak ditemukan di DOM!");
      return;
    }
    saveBtn.addEventListener("click", () => this._handleSaveProfile());
  },

  async _handleSaveProfile() {
    console.log("Klik simpan terdeteksi");
    const fullName = document.getElementById("fullNameInput").value.trim();
    const username = document.getElementById("usernameInput").value.trim();
    const experienceRadios = document.querySelectorAll(
      'input[name="experience"]'
    );
    let experience = "";
    experienceRadios.forEach((radio) => {
      if (radio.checked) experience = radio.value;
    });

    // Get pending profile picture from the view
    const pendingProfilePicture = this.view.getPendingProfilePicture();

    console.log({
      fullName,
      username,
      experience,
      hasPendingPicture: !!pendingProfilePicture,
    });

    // Show loading state
    const saveBtn = document.getElementById("saveProfileBtn");
    const originalBtnText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = pendingProfilePicture
      ? "Saving Profile & Uploading Picture..."
      : "Saving Profile...";

    try {
      console.log("Memulai updateUsername");
      await ProfileModel.updateUsername(username);
      console.log("updateUsername selesai");

      console.log("Memulai saveSetupData");
      await ProfileModel.saveSetupData({ name: fullName, experience });
      console.log("saveSetupData selesai");

      // Upload profile picture if there's a pending one
      if (pendingProfilePicture) {
        console.log("Memulai upload profile picture");
        const updatedUserData = await ProfileModel.uploadProfilePicture(
          pendingProfilePicture
        );
        console.log(
          "Upload profile picture selesai, updated user data:",
          updatedUserData
        );

        // Refresh user data from API to get the latest profile picture URL
        try {
          await authService.getCurrentUser();
          console.log(
            "Refreshed user data from API after profile picture upload"
          );
        } catch (error) {
          console.warn("Failed to refresh user data from API:", error);
        }

        // Refresh the profile display to show the uploaded picture
        const profile = await ProfileModel.getUserProfile();
        await this.view.showProfile(profile);

        // Update the navigation bar with the new profile picture
        this.updateNavigationBarProfilePicture();
      }

      // Mark as saved and clear pending changes
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
      // Reset button state
      saveBtn.disabled = false;
      saveBtn.textContent = originalBtnText;
    }
  },

  /**
   * Update the navigation bar with the current user's profile picture
   */
  updateNavigationBarProfilePicture() {
    try {
      const userData = authService.getUserData();
      console.log("Updating navigation bar with user data:", userData);

      // Find the navigation bar profile icon container
      const profileContainer = document.querySelector(
        ".app-profile-icon-container"
      );
      if (profileContainer) {
        // Import NavigationBar dynamically to avoid circular dependencies
        import("../../components/NavigationBar.js").then(
          ({ NavigationBar }) => {
            const navbar = new NavigationBar({
              currentPath: window.location.hash.slice(1),
              userInitial: (userData?.username || "User")
                .charAt(0)
                .toUpperCase(),
              username: userData?.username || "User",
              profilePictureUrl: userData?.profilePictureUrl,
              showProfile: true,
            });

            // Update the profile picture
            navbar.updateProfilePicture(
              userData?.profilePictureUrl,
              userData?.username
            );
            console.log("Navigation bar profile picture updated");
          }
        );
      }
    } catch (error) {
      console.error("Error updating navigation bar profile picture:", error);
    }
  },
};

export default ProfilePresenter;

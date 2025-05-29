import { updateData } from "../../data/api.js";
import { saveSetupData, getAllSetupData } from "../../utils/indexeddb.js";
import authService from "../../data/auth-service.js";
import profilePictureService from "../../data/profile-picture-service.js";

const ProfileModel = {
  async getUserProfile() {
    const setupData = await getAllSetupData();
    const userData = authService.getUserData();

    // Get profile picture URL using the service
    const profilePictureUrl = profilePictureService.getProfilePictureUrl(
      userData?.profilePictureUrl
    );

    return {
      avatar: profilePictureUrl,
      fullName: setupData[0]?.name || "",
      username: userData?.username || "",
      experience: setupData[0]?.experience || "",
    };
  },

  async uploadProfilePicture(file) {
    try {
      const updatedUserData = await profilePictureService.uploadProfilePicture(
        file
      );
      return updatedUserData;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  },

  async updateUsername(newUsername) {
    const userData = authService.getUserData();

    if (!userData) {
      throw new Error("User belum login");
    }

    if (newUsername === userData.username) {
      // Username tidak berubah, skip update API
      return;
    }

    // Panggil API PUT /api/account untuk update username
    const updatedUser = await updateData("/api/account", {
      username: newUsername,
      email: userData.email, // asumsi masih wajib dikirim
    });

    // Ambil token dan refreshToken yang sudah ada
    const token = authService.getToken();
    const refreshToken = authService.getRefreshToken();

    // Simpan kembali data lengkap agar tidak hilang
    authService.saveAuthData({
      token,
      refreshToken,
      user: {
        ...userData,
        username: updatedUser.username,
      },
    });
  },

  async saveSetupData({ name, experience }) {
    try {
      // Get current user data
      const userData = authService.getUserData();
      if (!userData || !userData.id) {
        throw new Error("User data not found. Please log in again.");
      }

      // Get existing setup data
      const setupDataArr = await getAllSetupData();
      const existingData = setupDataArr.find(
        (data) => data.userId === userData.id
      );

      // Prepare data to save
      const dataToSave = {
        userId: userData.id,
        name,
        experience,
        completedAt: new Date().toISOString(),
      };

      // If there's existing data, preserve other fields
      if (existingData) {
        Object.assign(dataToSave, {
          interest: existingData.interest,
          lat: existingData.lat,
          lon: existingData.lon,
        });
      }

      console.log("Saving profile setup data:", dataToSave);
      await saveSetupData(dataToSave);
    } catch (error) {
      console.error("Error saving profile setup data:", error);
      throw error;
    }
  },
};

export default ProfileModel;

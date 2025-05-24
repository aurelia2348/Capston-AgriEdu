import { updateData } from '../../data/api.js';
import { saveSetupData, getAllSetupData } from '../../utils/indexeddb.js';
import authService from '../../data/auth-service.js';

const ProfileModel = {
  async getUserProfile() {
    const setupData = await getAllSetupData();
    const userData = authService.getUserData();

    return {
      avatar: null,
      fullName: setupData[0]?.name || '',
      username: userData?.username || '',
      experience: setupData[0]?.experience || '',
    };
  },

  async updateUsername(newUsername) {
    const userData = authService.getUserData();

    if (!userData) {
      throw new Error('User belum login');
    }

    if (newUsername === userData.username) {
      // Username tidak berubah, skip update API
      return;
    }

    // Panggil API PUT /api/account untuk update username
    const updatedUser = await updateData('/api/account', {
      username: newUsername,
      email: userData.email,  // asumsi harus dikirim juga
    });

    // Update user data di local storage authService
    const newUserData = { ...userData, username: updatedUser.username };
    authService.saveAuthData({ user: newUserData });
  },

  async saveSetupData({ name, experience }) {
    // Ambil data setup lama dulu, jika ada
    const setupDataArr = await getAllSetupData();

    let id = setupDataArr[0]?.id;

    // Kalau belum ada data, buat baru
    const dataToSave = {
      id, // kalau undefined, IndexedDB auto increment
      name,
      experience,
    };

    await saveSetupData(dataToSave);
  },
};

export default ProfileModel;

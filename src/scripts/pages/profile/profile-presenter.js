import ProfileModel from './profile-model';
import authService from '../../data/auth-service';

const ProfilePresenter = {
async init(view) {
    this.view = view;

    try {
      await authService.getCurrentUser();
    } catch (error) {
      console.warn('Gagal update user data dari API:', error);
    }
    const profile = await ProfileModel.getUserProfile();
    view.showProfile(profile);

    this._setupEventListeners();
  },

_setupEventListeners() {
  const saveBtn = document.getElementById('saveProfileBtn');
  console.log('saveBtn:', saveBtn);
  if (!saveBtn) {
    console.error('Tombol simpan tidak ditemukan di DOM!');
    return;
  }
  saveBtn.addEventListener('click', () => this._handleSaveProfile());
},


async _handleSaveProfile() {
  console.log('Klik simpan terdeteksi');
  const fullName = document.getElementById('fullNameInput').value.trim();
  const username = document.getElementById('usernameInput').value.trim();
  const experienceRadios = document.querySelectorAll('input[name="experience"]');
  let experience = '';
  experienceRadios.forEach(radio => {
    if (radio.checked) experience = radio.value;
  });
  console.log({ fullName, username, experience });

  try {
    console.log('Memulai updateUsername');
    await ProfileModel.updateUsername(username);
    console.log('updateUsername selesai');

    console.log('Memulai saveSetupData');
    await ProfileModel.saveSetupData({ name: fullName, experience });
    console.log('saveSetupData selesai');

    alert('Profil berhasil disimpan!');
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menyimpan profil: ' + error.message);
  }
}

};

export default ProfilePresenter;

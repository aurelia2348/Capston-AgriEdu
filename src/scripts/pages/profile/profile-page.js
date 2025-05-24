import ProfilePresenter from './profile-presenter';

export default class ProfilePage {
async render() {
  return `
    <section class="container-profile">
      <h1>Profile Pengguna</h1>
      <div class="profile-avatar-wrapper">
        <div class="avatar-left">
          <img src="default-avatar.png" alt="Avatar" id="avatarPreview" class="avatar"/>
        </div>
        <div class="edit-right">
          <button id="editAvatarBtn">Edit Photo</button>
          <p class="avatar-note">Format harus berupa gambar. Tidak boleh lebih dari 2MB.</p>
        </div>
      </div>

      <div class="profile-info">
        <div class="input-group">
          <label for="fullNameInput">Full Name:</label>
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

      <!-- Tombol Simpan Perubahan -->
      <div class="profile-save-btn-wrapper" style="margin-top: 20px;">
        <button id="saveProfileBtn" class="btn btn-primary">Simpan Perubahan</button>
      </div>
    </section>
  `;
}

  async afterRender() {
    ProfilePresenter.init(this);

    const editBtn = document.getElementById('editAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

    editBtn.addEventListener('click', () => {
      avatarInput.click();
    });

    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

showProfile({ avatar, fullName, username, experience }) {
  document.getElementById('fullNameInput').value = fullName || '';
  document.getElementById('usernameInput').value = username || '';

  if (experience) {
    const radio = document.querySelector(`input[name="experience"][value="${experience}"]`);
    if (radio) radio.checked = true;
  }

  if (avatar) {
    document.getElementById('avatarPreview').src = avatar;
  }
}

}

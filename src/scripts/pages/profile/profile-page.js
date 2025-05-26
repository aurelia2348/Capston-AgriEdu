import ProfilePresenter from './profile-presenter';

export default class ProfilePage {
async render(state) {
  return `
    <div class="home-container">
      <header class="home-navbar">
        <div class="home-navbar-content">
          <a href="#/home" class="home-logo">
            <img src="logo/Main-Logo-Black.png" alt="AgriEdu" style="height: 52px; width: auto;">
          </a>
          <div class="home-menu-toggle" id="menuToggle">
            <i class="fas fa-bars"></i>
          </div>
          <nav class="home-nav">
            <a href="#/home" class="nav-link">Home</a>
            <a href="#/learning" class="nav-link">Learning</a>
            <a href="#/community" class="nav-link">Community</a>
            <a href="#/diagnosis" class="nav-link">Diagnosis</a>
            <a href="#/chatbot" class="nav-link">AI Assistant</a>
          </nav>
          <div class="user-profile-container">
            <a href="#/logout" class="home-logout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
            <div class="home-profile-icon">${state?.user?.initial ?? 'U'}</div>
          </div>
        </div>
      </header>

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
      <footer class="profile-footer">
        <p>&copy; 2025 AgriEdu. All rights reserved.</p>
      </footer>
    </div>
  `;
}


async afterRender() {
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
  ProfilePresenter.init(this);
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

  document.getElementById('sidebarUsername').textContent = username || '';
document.getElementById('sidebarExperience').textContent = experience || '';
if (avatar) {
  document.getElementById('sidebarAvatar').src = avatar;
}

}

}

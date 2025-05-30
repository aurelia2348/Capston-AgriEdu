import { NavigationBar } from "../../components/NavigationBar.js";
import CommunityModel from "./ComunityPage-Model.js";
import authService from "../../data/auth-service.js";
import profilePictureService from "../../data/profile-picture-service.js";
import ProfileModel from "../profile/profile-model.js";
import CONFIG from "../../config.js";

export default class CommunityPage {
  constructor() {
    this.posts = [];
  }
  async render() {
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
      <div class="community-page-container">
        ${navbar.render()}

        <section class="community-banner">
          <div class="banner-content" data-aos="fade-up" data-aos-duration="1000">
            <img src="logo/Comunity-Main.png" alt="Community Icon" class="banner-icon" />
            <div class="banner-text">
              <h2>Selamat datang di Komunitas AgriEdu!</h2>
              <p>Komunitas untuk saling berbagi solusi dan pengalaman bercocok tanam. Mulai berbagi pengalaman Anda.</p>
            </div>
          </div>
        </section>

        <div class="profile-container">
          <aside class="profile-sidebar" data-aos="fade-right" data-aos-duration="1000">
            <div class="sidebar-avatar">
              <img src="images/avatar.jpg" alt="Avatar" class="avatar" id="sidebarAvatar"/>
              <p id="sidebarUsername">Username User</p>
              <p id="sidebarExperience">Experience Level</p>
              <button class="sidebar-button" id="createPostBtn">Unggah diskusi</button>
            </div>
          </aside>

          <main class="community-content" data-aos="fade-left" data-aos-duration="1000">
            <div class="community-header">
              <h1>Diskusi Komunitas</h1>
              <button class="create-post-btn" id="createPostBtnMain">+ Buat Diskusi Baru</button>
            </div>

            <div class="posts-container" id="postsContainer">
              <div class="loading-posts">Memuat diskusi...</div>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  async afterRender() {
    window.communityPage = this;

    this.setupNavigationEvents();

    if (typeof AOS !== "undefined") {
      AOS.init({
        once: true,
      });
    }
    this.setupCreatePostButtons();
    await this.loadUserInfo();
    await this.loadPosts();
  }

  setupNavigationEvents() {}

  setupCreatePostButtons() {
    const createPostBtn = document.getElementById("createPostBtn");
    const createPostBtnMain = document.getElementById("createPostBtnMain");

    if (createPostBtn) {
      createPostBtn.addEventListener("click", () => {
        window.location.hash = "#/form";
      });
    }

    if (createPostBtnMain) {
      createPostBtnMain.addEventListener("click", () => {
        window.location.hash = "#/form";
      });
    }
  }

  async loadUserInfo() {
    try {
      const token = authService.getToken();

      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            if (userData.username) {
              const sidebarUsername =
                document.getElementById("sidebarUsername");
              if (sidebarUsername) {
                sidebarUsername.textContent = userData.username;
              }
            }

            const sidebarAvatar = document.getElementById("sidebarAvatar");
            if (sidebarAvatar) {
              await profilePictureService.updateImageElement(
                sidebarAvatar,
                userData.profilePictureUrl,
                userData.username
              );
            }
          }
        } catch (apiError) {
          console.warn("Failed to refresh user data from API:", apiError);
        }
      } else {
        console.warn("No token available");
      }

      try {
        const profile = await ProfileModel.getUserProfile();
        const experienceLevel = profile.experience || "Belum diatur";

        const sidebarExperience = document.getElementById("sidebarExperience");
        if (sidebarExperience) {
          sidebarExperience.textContent = experienceLevel;
        }
      } catch (profileError) {
        console.error(
          "Failed to get experience from ProfileModel:",
          profileError
        );
        const sidebarExperience = document.getElementById("sidebarExperience");
        if (sidebarExperience) {
          sidebarExperience.textContent = "Gagal ambil experience";
        }
      }
    } catch (err) {
      console.error("Gagal ambil user info:", err);
    }
  }

  async loadPosts() {
    try {
      const response = await CommunityModel.getAllPosts();

      let postsData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          postsData = response.data;
        } else if (response.data.posts && Array.isArray(response.data.posts)) {
          postsData = response.data.posts;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
        }
      } else if (Array.isArray(response)) {
        postsData = response;
      }

      const currentUser = authService.getUserData();

      postsData = postsData.map((post) => ({
        ...post,
        author:
          post.userId ||
          (currentUser && post.userId === currentUser.id ? currentUser : null),
      }));

      this.posts = postsData;
      this.renderPosts();
    } catch (error) {
      console.error("Error loading posts:", error);

      let errorMessage = error.message;

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS") ||
        error.message.includes("network") ||
        error.name === "TypeError"
      ) {
        errorMessage =
          "Tidak dapat terhubung ke server API. Periksa koneksi internet dan pastikan server API berjalan.";
      }

      document.getElementById("postsContainer").innerHTML = `
        <div class="error-message">
          <p>Gagal memuat diskusi: ${errorMessage}</p>
          <p><small>URL API: ${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.GET_ALL}</small></p>
          <p><small>Pastikan server API berjalan dan dapat diakses dari browser.</small></p>
          <button onclick="location.reload()">Coba Lagi</button>
        </div>
      `;
    }
  }

  async deletePost(postId) {
    const result = await Swal.fire({
      title: "Hapus Diskusi",
      text: "Apakah Anda yakin ingin menghapus diskusi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await CommunityModel.deletePost(postId);
      await this.loadPosts();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Diskusi berhasil dihapus!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal menghapus diskusi: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  renderPosts() {
    const container = document.getElementById("postsContainer");
    const currentUser = authService.getUserData();
    const currentUserId = currentUser?.id;

    if (!this.posts || this.posts.length === 0) {
      container.innerHTML = `
        <div class="no-posts">
          <p>Belum ada diskusi. Jadilah yang pertama membuat diskusi!</p>
          <button class="create-first-post-btn" onclick="window.location.hash='#/form'">Buat Diskusi Pertama</button>
        </div>
      `;
      return;
    }

    const postsHTML = this.posts
      .map((post) => {
        if (this.posts.indexOf(post) === 0) {
        }

        let username = "Anonymous";
        let postUserId = null;

        if (post.userId && typeof post.userId === "object") {
          username = post.userId.username || "Anonymous";
          postUserId = post.userId.id;
        } else if (post.author) {
          username = post.author.username || "Anonymous";
          postUserId = post.author.id;
        } else if (post.userId === currentUserId) {
          const currentUserData = authService.getUserData();
          if (currentUserData) {
            username = currentUserData.username || "Anonymous";
            postUserId = currentUserId;
          }
        }

        const isOwner = currentUserId && postUserId === currentUserId;

        const maxContentLength = 150;
        const truncatedContent =
          post.content && post.content.length > maxContentLength
            ? post.content.substring(0, maxContentLength) + "..."
            : post.content || "";

        let imageUrl = "";
        if (post.imageUrl) {
          if (
            post.imageUrl.startsWith("http://") ||
            post.imageUrl.startsWith("https://")
          ) {
            imageUrl = post.imageUrl;
          } else {
            const cleanImagePath = post.imageUrl.replace(
              /^\/api\/posts\/image\//,
              ""
            );
            imageUrl = `${CONFIG.BASE_URL}/api/posts/image/${cleanImagePath}`;
          }
        }

        const profilePictureId = `post-avatar-${post.id}`;

        return `
          <div class="post-card" onclick="window.communityPage.showPostDetail('${
            post.id
          }')" style="cursor: pointer;">
            <div class="post-header">
              <div class="post-author">
                <div class="author-avatar-container" id="${profilePictureId}">
                  <div class="author-avatar fallback-avatar">${username
                    .charAt(0)
                    .toUpperCase()}</div>
                </div>
                <div class="author-info">
                  <h4>${username}</h4>
                  <span class="post-date">${this.formatDate(
                    post.createdAt
                  )}</span>
                </div>
              </div>
              ${
                isOwner
                  ? `
                <button class="delete-post-btn" onclick="event.stopPropagation(); window.communityPage.deletePost('${post.id}')" title="Hapus diskusi">
                  <i class="fas fa-trash"></i>
                </button>
              `
                  : ""
              }
            </div>
            <div class="post-content">
              <h3>${post.title || "Tanpa Judul"}</h3>
              <p>${truncatedContent}</p>
              ${
                imageUrl
                  ? `
                <div class="post-image-container">
                  <img src="${imageUrl}" alt="Post image" class="post-image">
                </div>
              `
                  : ""
              }
            </div>
            <div class="post-actions">
              <button class="action-btn comment-btn" onclick="event.stopPropagation(); window.communityPage.showComments('${
                post.id
              }')">
                <i class="fas fa-comment"></i> Komentar
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = postsHTML;

    this.loadPostProfilePictures();
  }

  async loadPostProfilePictures() {
    for (const post of this.posts) {
      const profilePictureId = `post-avatar-${post.id}`;
      const container = document.getElementById(profilePictureId);

      if (!container) continue;

      let username = "Anonymous";
      let profilePictureUrl = null;

      if (post.userId && typeof post.userId === "object") {
        username = post.userId.username || "Anonymous";
        profilePictureUrl = post.userId.profilePictureUrl;
      } else if (post.author) {
        username = post.author.username || "Anonymous";
        profilePictureUrl = post.author.profilePictureUrl;
      } else {
        const currentUser = authService.getUserData();
        const currentUserId = currentUser?.id;
        if (post.userId === currentUserId && currentUser) {
          username = currentUser.username || "Anonymous";
          profilePictureUrl = currentUser.profilePictureUrl;
        }
      }

      if (profilePictureUrl) {
        try {
          await profilePictureService.updateContainerElementSafe(
            container,
            profilePictureUrl,
            username,
            "medium"
          );
        } catch (error) {
          console.warn(
            `Failed to load profile picture for post ${post.id}:`,
            error
          );
        }
      }
    }
  }

  async showComments(postId) {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        CommunityModel.getPostById(postId),
        CommunityModel.getComments(postId),
      ]);

      const post = postResponse.data;
      const comments = commentsResponse.data || [];

      let postUsername = "Anonymous";
      if (post.userId && typeof post.userId === "object") {
        postUsername = post.userId.username || "Anonymous";
      } else if (post.author) {
        postUsername = post.author.username || "Anonymous";
      }

      const modal = document.createElement("div");
      modal.className = "post-detail-modal";
      modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Komentar Diskusi</h2>
            <button class="modal-close" onclick="this.closest('.post-detail-modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="post-summary">
              <div class="post-detail-header">
                <div class="author-avatar-container" id="comment-post-avatar-${postId}">
                  <div class="author-avatar">${postUsername
                    .charAt(0)
                    .toUpperCase()}</div>
                </div>
                <div class="author-info">
                  <h4>${postUsername}</h4>
                  <span class="post-date">${this.formatDate(
                    post.createdAt
                  )}</span>
                </div>
              </div>
              <h3>${post.title || "Tanpa Judul"}</h3>
              <p>${post.content || "Tidak ada konten"}</p>
            </div>

            <div class="comments-section">
              <h4>Komentar (${comments.length})</h4>
              <div class="add-comment">
                <textarea id="new-comment-${postId}" placeholder="Tulis komentar..." rows="3"></textarea>
                <button onclick="window.communityPage.addComment('${postId}')" class="add-comment-btn">
                  <i class="fas fa-paper-plane"></i> Kirim Komentar
                </button>
              </div>
              <div class="comments-list" id="comments-list-${postId}">
                ${this.renderComments(comments, postId)}
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      this.loadCommentPostProfilePicture(post, postId);

      this.loadCommentProfilePictures(comments);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal memuat komentar: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  async loadCommentPostProfilePicture(post, postId) {
    const container = document.getElementById(`comment-post-avatar-${postId}`);
    if (!container) return;

    let postUsername = "Anonymous";
    let profilePictureUrl = null;

    if (post.userId && typeof post.userId === "object") {
      postUsername = post.userId.username || "Anonymous";
      profilePictureUrl = post.userId.profilePictureUrl;
    } else if (post.author) {
      postUsername = post.author.username || "Anonymous";
      profilePictureUrl = post.author.profilePictureUrl;
    }

    if (profilePictureUrl) {
      try {
        await profilePictureService.updateContainerElementSafe(
          container,
          profilePictureUrl,
          postUsername,
          "medium"
        );
      } catch (error) {
        console.warn(
          `Failed to load profile picture for comment post ${postId}:`,
          error
        );
      }
    }
  }

  async loadCommentProfilePictures(comments) {
    for (const comment of comments) {
      const commentId = comment._id || comment.id;
      const commentProfilePictureId = `comment-avatar-${commentId}`;
      const container = document.getElementById(commentProfilePictureId);

      if (!container) {
        console.warn(`Container not found for comment ${commentId}`);
        continue;
      }

      const userData = this.extractCommentUserData(comment);

      if (
        userData.profilePictureUrl &&
        typeof userData.profilePictureUrl === "string" &&
        userData.profilePictureUrl.trim() !== "" &&
        userData.profilePictureUrl !== "null"
      ) {
        try {
          await profilePictureService.updateContainerElementSafe(
            container,
            userData.profilePictureUrl,
            userData.username,
            "small"
          );
        } catch (error) {
          console.warn(
            `Failed to load profile picture for comment ${
              comment._id || comment.id
            }:`,
            error
          );
          container.innerHTML = profilePictureService.createFallbackAvatar(
            userData.username,
            "small"
          );
        }
      } else {
        container.innerHTML = profilePictureService.createFallbackAvatar(
          userData.username,
          "small"
        );
      }
    }
  }

  extractCommentUserData(comment) {
    const currentUser = authService.getUserData();
    const currentUserId = currentUser?.id;

    let commentUsername = "Anonymous";
    let commentUserId = null;
    let profilePictureUrl = null;

    if (comment.userId && typeof comment.userId === "object") {
      commentUsername = comment.userId.username || "Anonymous";
      commentUserId = comment.userId.id;
      profilePictureUrl = comment.userId.profilePictureUrl;
    } else {
      if (comment.userId === currentUserId && currentUser) {
        commentUsername = currentUser.username || "Anonymous";
        commentUserId = currentUserId;
        profilePictureUrl = currentUser.profilePictureUrl;
      } else {
        console.warn(
          `Comment ${
            comment._id || comment.id
          } has unexpected userId structure:`,
          comment.userId
        );
      }
    }

    return {
      username: commentUsername,
      userId: commentUserId,
      profilePictureUrl: profilePictureUrl,
      isOwner: currentUserId && commentUserId === currentUserId,
    };
  }

  renderComments(comments, postId) {
    if (!comments || comments.length === 0) {
      return '<p class="no-comments">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
    }

    return comments
      .map((comment) => {
        const userData = this.extractCommentUserData(comment);

        const commentProfilePictureId = `comment-avatar-${
          comment._id || comment.id
        }`;

        const fallbackAvatarHtml = profilePictureService.createFallbackAvatar(
          userData.username,
          "small"
        );

        return `
        <div class="comment-item">
          <div class="comment-header">
            <div class="comment-author">
              <div class="author-avatar-container" id="${commentProfilePictureId}">
                ${fallbackAvatarHtml}
              </div>
              <div class="author-info">
                <h5>${userData.username}</h5>
                <span class="comment-date">${this.formatDate(
                  comment.createdAt
                )}</span>
              </div>
            </div>
            ${
              userData.isOwner
                ? `
              <button class="delete-comment-btn" onclick="window.communityPage.deleteComment('${postId}', '${
                    comment._id || comment.id
                  }')" title="Hapus komentar">
                <i class="fas fa-trash"></i>
              </button>
            `
                : ""
            }
          </div>
          <div class="comment-content">
            <p>${comment.content || "Tidak ada konten"}</p>
          </div>
        </div>
      `;
      })
      .join("");
  }

  async addComment(postId) {
    try {
      const textarea = document.getElementById(`new-comment-${postId}`);
      const content = textarea.value.trim();

      if (!content) {
        Swal.fire({
          icon: "warning",
          title: "Komentar Kosong",
          text: "Silakan tulis komentar terlebih dahulu.",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await CommunityModel.createComment(postId, content);
      textarea.value = "";

      const commentsResponse = await CommunityModel.getComments(postId);
      const comments = commentsResponse.data || [];
      const commentsList = document.getElementById(`comments-list-${postId}`);
      if (commentsList) {
        commentsList.innerHTML = this.renderComments(comments, postId);
        this.loadCommentProfilePictures(comments);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Komentar berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal menambah komentar: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  async deleteComment(postId, commentId) {
    const result = await Swal.fire({
      title: "Hapus Komentar",
      text: "Apakah Anda yakin ingin menghapus komentar ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await CommunityModel.deleteComment(postId, commentId);

      const commentsResponse = await CommunityModel.getComments(postId);
      const comments = commentsResponse.data || [];
      const commentsList = document.getElementById(`comments-list-${postId}`);
      if (commentsList) {
        commentsList.innerHTML = this.renderComments(comments, postId);
        this.loadCommentProfilePictures(comments);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Komentar berhasil dihapus!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal menghapus komentar: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  async showPostDetail(postId) {
    try {
      const response = await CommunityModel.getPostById(postId);
      const post = response.data;

      let username = "Anonymous";
      if (post.userId && typeof post.userId === "object") {
        username = post.userId.username || "Anonymous";
      } else if (post.author) {
        username = post.author.username || "Anonymous";
      } else if (post.User) {
        username = post.User.username || post.User.name || "Anonymous";
      } else if (post.user) {
        username = post.user.username || post.user.name || "Anonymous";
      }

      let imageUrl = "";
      const imageFields = [
        post.imageUrl,
        post.image,
        post.photo,
        post.picture,
        post.attachment,
      ];

      for (const field of imageFields) {
        if (field && field.trim()) {
          if (field.startsWith("http://") || field.startsWith("https://")) {
            imageUrl = field;
            break;
          } else {
            const cleanImagePath = field.replace(/^\/api\/posts\/image\//, "");
            imageUrl = `${CONFIG.BASE_URL}/api/posts/image/${cleanImagePath}`;
            break;
          }
        }
      }

      const modal = document.createElement("div");
      modal.className = "post-detail-modal";
      modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Detail Diskusi</h2>
            <button class="modal-close" onclick="this.closest('.post-detail-modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="post-detail-header">
              <div class="author-avatar-container" id="post-detail-avatar-${postId}">
                <div class="author-avatar">${username
                  .charAt(0)
                  .toUpperCase()}</div>
              </div>
              <div class="author-info">
                <h4>${username}</h4>
                <span class="post-date">${this.formatDate(
                  post.createdAt
                )}</span>
              </div>
            </div>
            <div class="post-detail-content">
              <h3>${post.title || "Tanpa Judul"}</h3>
              <p>${post.content || "Tidak ada konten"}</p>
              ${
                imageUrl
                  ? `
                <div class="post-detail-image">
                  <img src="${imageUrl}" alt="Post image"
                       onerror="this.parentElement.style.display='none';">
                </div>
              `
                  : ""
              }
            </div>
            <div class="post-actions-detail">
              <button onclick="this.closest('.post-detail-modal').remove(); window.communityPage.showComments('${postId}')" class="action-btn comment-btn">
                <i class="fas fa-comment"></i> Lihat Komentar
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      this.loadPostDetailProfilePicture(post, postId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal memuat detail diskusi: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  async loadPostDetailProfilePicture(post, postId) {
    const container = document.getElementById(`post-detail-avatar-${postId}`);
    if (!container) return;

    let username = "Anonymous";
    let profilePictureUrl = null;

    if (post.userId && typeof post.userId === "object") {
      username = post.userId.username || "Anonymous";
      profilePictureUrl = post.userId.profilePictureUrl;
    } else if (post.author) {
      username = post.author.username || "Anonymous";
      profilePictureUrl = post.author.profilePictureUrl;
    } else if (post.User) {
      username = post.User.username || post.User.name || "Anonymous";
      profilePictureUrl = post.User.profilePictureUrl;
    } else if (post.user) {
      username = post.user.username || post.user.name || "Anonymous";
      profilePictureUrl = post.user.profilePictureUrl;
    }

    if (profilePictureUrl) {
      try {
        await profilePictureService.updateContainerElementSafe(
          container,
          profilePictureUrl,
          username,
          "medium"
        );
      } catch (error) {
        console.warn(
          `Failed to load profile picture for post detail ${postId}:`,
          error
        );
      }
    }
  }

  async deletePost(postId) {
    const result = await Swal.fire({
      title: "Hapus Diskusi",
      text: "Apakah Anda yakin ingin menghapus diskusi ini? Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await CommunityModel.deletePost(postId);
      await this.loadPosts();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Diskusi berhasil dihapus!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal menghapus diskusi: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  formatDate(dateString) {
    if (!dateString) return "Baru saja";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) return "Baru saja";
      if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Baru saja";
    }
  }
}

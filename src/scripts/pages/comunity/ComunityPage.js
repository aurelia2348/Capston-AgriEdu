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
    // Get user data from auth service for navbar
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
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
    // Make this instance globally accessible for delete functionality
    window.communityPage = this;

    this.setupNavigationEvents();

    // Inisialisasi AOS setelah elemen dirender
    if (typeof AOS !== "undefined") {
      AOS.init({
        once: true, // animasi hanya terjadi sekali
      });
    }
    this.setupCreatePostButtons();
    await this.loadUserInfo();
    await this.loadPosts();
  }

  setupNavigationEvents() {
    // Get user data from auth service for navbar
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });
    navbar.bindEvents();
  }

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
      console.log("Token available:", !!token);

      if (token) {
        // Try to get fresh user data from API
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            // Update username
            if (userData.username) {
              const sidebarUsername =
                document.getElementById("sidebarUsername");
              if (sidebarUsername) {
                sidebarUsername.textContent = userData.username;
              }
              console.log("Updated sidebar username to:", userData.username);
            }

            // Update profile picture using the profile picture service
            const sidebarAvatar = document.getElementById("sidebarAvatar");
            if (sidebarAvatar) {
              await profilePictureService.updateImageElement(
                sidebarAvatar,
                userData.profilePictureUrl,
                userData.username
              );
              console.log("Updated sidebar profile picture");
            }
          }
        } catch (apiError) {
          console.warn("Failed to refresh user data from API:", apiError);
        }
      } else {
        console.warn("No token available");
      }

      // Get experience level using ProfileModel (same method as ProfilePage)
      try {
        const profile = await ProfileModel.getUserProfile();
        const experienceLevel = profile.experience || "Belum diatur";

        const sidebarExperience = document.getElementById("sidebarExperience");
        if (sidebarExperience) {
          sidebarExperience.textContent = experienceLevel;
        }
        console.log("Updated sidebar experience to:", experienceLevel);
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
      console.log("Raw posts response:", response);

      // Handle different response structures
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

      // Get current user data for post ownership checks
      const currentUser = authService.getUserData();

      // Process posts to include author information based on API schema
      postsData = postsData.map((post) => ({
        ...post,
        author:
          post.userId ||
          (currentUser && post.userId === currentUser.id ? currentUser : null),
      }));

      console.log("Processed posts data:", postsData);
      this.posts = postsData;
      this.renderPosts();
    } catch (error) {
      console.error("Error loading posts:", error);

      let errorMessage = error.message;

      // Check for specific error types
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
      // Reload posts after successful deletion
      await this.loadPosts();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Diskusi berhasil dihapus!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
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

    console.log("=== RENDER POSTS DEBUG ===");
    console.log("Current user data:", currentUser);
    console.log("Posts to render:", this.posts);

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
        // Debug first post only to avoid console spam
        if (this.posts.indexOf(post) === 0) {
          console.log("=== FIRST POST STRUCTURE ===");
          console.log("Post fields:", Object.keys(post));
          console.log("User data:", post.userId || post.author);
        }

        // Extract username using the correct schema
        let username = "Anonymous";
        let postUserId = null;

        // Check for author data in the post based on API schema
        if (post.userId && typeof post.userId === "object") {
          username = post.userId.username || "Anonymous";
          postUserId = post.userId.id;
        } else if (post.author) {
          username = post.author.username || "Anonymous";
          postUserId = post.author.id;
        } else if (post.userId === currentUserId) {
          // If this is current user's post but no author data, use current user data
          const currentUserData = authService.getUserData();
          if (currentUserData) {
            username = currentUserData.username || "Anonymous";
            postUserId = currentUserId;
          }
        }

        // Check ownership for delete button
        const isOwner = currentUserId && postUserId === currentUserId;

        // Truncate content for preview
        const maxContentLength = 150;
        const truncatedContent =
          post.content && post.content.length > maxContentLength
            ? post.content.substring(0, maxContentLength) + "..."
            : post.content || "";

        // Construct image URL based on API schema
        let imageUrl = "";
        if (post.imageUrl) {
          if (
            post.imageUrl.startsWith("http://") ||
            post.imageUrl.startsWith("https://")
          ) {
            imageUrl = post.imageUrl;
          } else {
            // Remove any leading /api/posts/image/ to prevent duplication
            const cleanImagePath = post.imageUrl.replace(
              /^\/api\/posts\/image\//,
              ""
            );
            imageUrl = `${CONFIG.BASE_URL}/api/posts/image/${cleanImagePath}`;
          }
        }

        // Generate unique ID for this post's profile picture
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
                  <img src="${imageUrl}" alt="Post image" class="post-image"
                       onerror="console.error('Image failed to load:', this.src); this.parentElement.style.display='none';"
                       onload="console.log('Image loaded successfully:', this.src);">
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
              ${
                isOwner
                  ? `
                <button class="action-btn delete-btn" onclick="event.stopPropagation(); window.communityPage.deletePost('${post.id}')" title="Hapus diskusi">
                  <i class="fas fa-trash"></i> Hapus
                </button>
              `
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = postsHTML;

    // Load profile pictures for all posts after rendering
    this.loadPostProfilePictures();

    console.log("=== RENDER POSTS COMPLETE ===");
  }

  /**
   * Load profile pictures for all posts using CORS-safe method
   */
  async loadPostProfilePictures() {
    for (const post of this.posts) {
      const profilePictureId = `post-avatar-${post.id}`;
      const container = document.getElementById(profilePictureId);

      if (!container) continue;

      // Extract profile picture data (same logic as in renderPosts)
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

      // Use the profile picture service to update the container with CORS-safe method
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
      console.log("Showing comments for post ID:", postId);

      // Get post details and comments based on API schema
      const [postResponse, commentsResponse] = await Promise.all([
        CommunityModel.getPostById(postId),
        CommunityModel.getComments(postId),
      ]);

      const post = postResponse.data;
      const comments = commentsResponse.data || [];

      console.log("Post data:", post);
      console.log("Comments data:", comments);

      // Extract post author username based on API schema
      let postUsername = "Anonymous";
      if (post.userId && typeof post.userId === "object") {
        postUsername = post.userId.username || "Anonymous";
      } else if (post.author) {
        postUsername = post.author.username || "Anonymous";
      }

      // Create modal for comments
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

      // Load profile picture for the post summary
      this.loadCommentPostProfilePicture(post, postId);

      // Load profile pictures for comments after modal is added to DOM
      this.loadCommentProfilePictures(comments);
    } catch (error) {
      console.error("Error showing comments:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal memuat komentar: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  /**
   * Load profile picture for post summary in comments modal
   * @param {Object} post - Post object
   * @param {string} postId - Post ID
   */
  async loadCommentPostProfilePicture(post, postId) {
    const container = document.getElementById(`comment-post-avatar-${postId}`);
    if (!container) return;

    // Extract profile picture data
    let postUsername = "Anonymous";
    let profilePictureUrl = null;

    if (post.userId && typeof post.userId === "object") {
      postUsername = post.userId.username || "Anonymous";
      profilePictureUrl = post.userId.profilePictureUrl;
    } else if (post.author) {
      postUsername = post.author.username || "Anonymous";
      profilePictureUrl = post.author.profilePictureUrl;
    }

    // Use the profile picture service to update the container with CORS-safe method
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

  /**
   * Load profile pictures for comments using CORS-safe method
   * @param {Array} comments - Array of comment objects
   */
  async loadCommentProfilePictures(comments) {
    for (const comment of comments) {
      const commentProfilePictureId = `comment-avatar-${comment.id}`;
      const container = document.getElementById(commentProfilePictureId);

      if (!container) {
        console.warn(`Container not found for comment ${comment.id}`);
        continue;
      }

      // Extract profile picture data based on API schema
      let commentUsername = "Anonymous";
      let profilePictureUrl = null;

      if (comment.userId && typeof comment.userId === "object") {
        commentUsername = comment.userId.username || "Anonymous";
        profilePictureUrl = comment.userId.profilePictureUrl;
      } else if (comment.author) {
        commentUsername = comment.author.username || "Anonymous";
        profilePictureUrl = comment.author.profilePictureUrl;
      } else {
        // If no userId object, check if it's the current user's comment
        const currentUser = authService.getUserData();
        const currentUserId = currentUser?.id;
        if (comment.userId === currentUserId && currentUser) {
          commentUsername = currentUser.username || "Anonymous";
          profilePictureUrl = currentUser.profilePictureUrl;
        }
      }

      // Only use the profile picture if it's a non-empty string
      if (
        typeof profilePictureUrl === "string" &&
        profilePictureUrl.trim() !== "" &&
        profilePictureUrl !== "null"
      ) {
        try {
          await profilePictureService.updateContainerElementSafe(
            container,
            profilePictureUrl,
            commentUsername,
            "small"
          );
          console.log(`Updated profile picture for comment ${comment.id}`);
        } catch (error) {
          console.warn(
            `Failed to load profile picture for comment ${comment.id}:`,
            error
          );
          // Show default avatar with initial
          container.innerHTML = `
            <div class="author-avatar small fallback-avatar">
              <img src="images/avatar.jpg" alt="${commentUsername}" onerror="this.style.display='none'; this.parentElement.innerHTML='${commentUsername
            .charAt(0)
            .toUpperCase()}'">
              <span class="fallback-text">${commentUsername
                .charAt(0)
                .toUpperCase()}</span>
            </div>
          `;
        }
      } else {
        // Always show default avatar with initial if no valid profile picture URL
        container.innerHTML = `
          <div class="author-avatar small fallback-avatar">
            <img src="images/avatar.jpg" alt="${commentUsername}" onerror="this.style.display='none'; this.parentElement.innerHTML='${commentUsername
          .charAt(0)
          .toUpperCase()}'">
            <span class="fallback-text">${commentUsername
              .charAt(0)
              .toUpperCase()}</span>
          </div>
        `;
        console.log(
          `No valid profile picture URL for comment ${comment.id}, using default avatar`
        );
      }
    }
  }

  renderComments(comments, postId) {
    if (!comments || comments.length === 0) {
      return '<p class="no-comments">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
    }

    const currentUser = authService.getUserData();
    const currentUserId = currentUser?.id;

    return comments
      .map((comment) => {
        // Extract comment author data based on API schema
        let commentUsername = "Anonymous";
        let commentUserId = null;

        if (comment.userId && typeof comment.userId === "object") {
          commentUsername = comment.userId.username || "Anonymous";
          commentUserId = comment.userId.id;
        } else if (comment.author) {
          commentUsername = comment.author.username || "Anonymous";
          commentUserId = comment.author.id;
        } else if (comment.userId === currentUserId) {
          const currentUserData = authService.getUserData();
          if (currentUserData) {
            commentUsername = currentUserData.username || "Anonymous";
            commentUserId = currentUserId;
          }
        }

        const isCommentOwner = currentUserId && commentUserId === currentUserId;

        // Generate unique ID for this comment's profile picture
        const commentProfilePictureId = `comment-avatar-${comment.id}`;

        return `
        <div class="comment-item">
          <div class="comment-header">
            <div class="comment-author">
              <div class="author-avatar-container" id="${commentProfilePictureId}">
                <div class="author-avatar small fallback-avatar">${commentUsername
                  .charAt(0)
                  .toUpperCase()}</div>
              </div>
              <div class="author-info">
                <h5>${commentUsername}</h5>
                <span class="comment-date">${this.formatDate(
                  comment.createdAt
                )}</span>
              </div>
            </div>
            ${
              isCommentOwner
                ? `
              <button class="delete-comment-btn" onclick="window.communityPage.deleteComment('${postId}', '${comment.id}')" title="Hapus komentar">
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

      console.log("Adding comment to post:", postId, "Content:", content);

      const response = await CommunityModel.createComment(postId, content);
      console.log("Comment created:", response);

      // Clear textarea
      textarea.value = "";

      // Refresh comments
      const commentsResponse = await CommunityModel.getComments(postId);
      const comments = commentsResponse.data || [];

      const commentsList = document.getElementById(`comments-list-${postId}`);
      if (commentsList) {
        commentsList.innerHTML = this.renderComments(comments, postId);
        // Load profile pictures for the updated comments
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
      console.error("Error adding comment:", error);
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
      console.log("Deleting comment:", commentId, "from post:", postId);

      await CommunityModel.deleteComment(postId, commentId);

      // Refresh comments
      const commentsResponse = await CommunityModel.getComments(postId);
      const comments = commentsResponse.data || [];

      const commentsList = document.getElementById(`comments-list-${postId}`);
      if (commentsList) {
        commentsList.innerHTML = this.renderComments(comments, postId);
        // Load profile pictures for the updated comments
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
      console.error("Error deleting comment:", error);
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
      console.log("Showing detail for post ID:", postId);
      const response = await CommunityModel.getPostById(postId);
      const post = response.data;

      console.log("Post detail data:", post);

      // Extract username with same logic as loadPostDetailProfilePicture for consistency
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

      // Extract image URL
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
            // Remove any leading /api/posts/image/ to prevent duplication
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

      // Load profile picture for the post detail
      this.loadPostDetailProfilePicture(post, postId);
    } catch (error) {
      console.error("Error showing post detail:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal memuat detail diskusi: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  }

  /**
   * Load profile picture for post detail modal
   * @param {Object} post - Post object
   * @param {string} postId - Post ID
   */
  async loadPostDetailProfilePicture(post, postId) {
    const container = document.getElementById(`post-detail-avatar-${postId}`);
    if (!container) return;

    // Extract profile picture data
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

    // Use the profile picture service to update the container with CORS-safe method
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
      console.log("Deleting post:", postId);

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
      console.error("Error deleting post:", error);
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

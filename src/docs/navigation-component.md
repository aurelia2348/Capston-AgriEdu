# Navigation Component Documentation

## Overview

The Navigation Component is a reusable navigation bar component for the AgriEdu application that provides consistent navigation across all authenticated pages. It includes responsive design, mobile menu functionality, and user profile integration.

## Files

### CSS Component

- **File**: `src/styles/navigation-component.css`
- **Purpose**: Contains all styles for the navigation bar component
- **Classes**: Uses `app-*` prefixed classes for consistency

### JavaScript Component

- **File**: `src/scripts/components/NavigationBar.js`
- **Purpose**: Provides the NavigationBar class for generating navigation HTML and handling events

## CSS Classes

### Main Navigation Classes

- `.app-navbar` - Main navigation container
- `.app-navbar-content` - Navigation content wrapper with max-width and centering
- `.app-logo` - Logo container with hover effects
- `.app-nav` - Navigation links container (uses CSS Grid)
- `.app-menu-toggle` - Mobile menu toggle button
- `.user-profile-container` - Container for profile icon and logout button
- `.app-logout` - Logout button styling
- `.app-profile-icon` - User profile icon (circular with user initial)

### Navigation Link Classes

- `.nav-link` - Base navigation link styling
- `.nav-link.active` - Active navigation link styling

### Mobile Navigation Classes

- `.app-nav.show` - Shows mobile navigation menu
- `.app-menu-toggle.active` - Active state for mobile menu toggle

## JavaScript Component Usage

### Basic Usage

```javascript
import { NavigationBar } from "../../components/NavigationBar.js";

// Create navigation bar instance
const navbar = new NavigationBar({
  currentPath: window.location.hash.slice(1),
  userInitial: "A",
  showProfile: true,
});

// Render navigation HTML
const navbarHTML = navbar.render();

// Set up event listeners (call after rendering to DOM)
navbar.bindEvents();
```

### Constructor Options

```javascript
const navbar = new NavigationBar({
  currentPath: "/home", // Current page path for active link highlighting
  userInitial: "A", // User's initial for profile icon
  showProfile: true, // Whether to show profile section (default: true)
  navItems: [
    // Custom navigation items (optional)
    { href: "#/home", text: "Home", className: "nav-link" },
    { href: "#/learning", text: "Learning", className: "nav-link" },
  ],
});
```

### Default Navigation Items

The component includes these default navigation items:

- Home (`#/home`)
- Learning (`#/learning`)
- Community (`#/community`)
- Diagnosis (`#/diagnosis`)
- AI Assistant (`#/chatbot`)

## Implementation in Pages

### Step 1: Import the Component

```javascript
import { NavigationBar } from "../../components/NavigationBar.js";
```

### Step 2: Add to Page Render Method

```javascript
render() {
  // Get user initial from localStorage
  const userName = localStorage.getItem("user_name") || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const navbar = new NavigationBar({
    currentPath: window.location.hash.slice(1),
    userInitial: userInitial,
    showProfile: true
  });

  return `
    <div class="page-container">
      ${navbar.render()}
      <!-- Page content here -->
    </div>
  `;
}
```

### Step 3: Set Up Events in afterRender

```javascript
async afterRender() {
  // Set up navigation bar events
  this.setupNavigationEvents();
}

setupNavigationEvents() {
  const mainContent = document.querySelector("#main-content");
  if (mainContent) {
    // Navigation link events
    const navLinks = mainContent.querySelectorAll(".app-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Close mobile menu if open
        const appNav = mainContent.querySelector(".app-nav");
        if (appNav) {
          appNav.classList.remove("show");
        }
      });
    });

    // Profile icon events
    const profileIcon = mainContent.querySelector(".app-profile-icon");
    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        const userName = localStorage.getItem("user_name") || "User";
        Swal.fire({
          icon: "info",
          title: "User Information",
          text: `Logged in as: ${userName}\nStatus: Active`,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      });
    }

    // Mobile navigation setup
    const menuToggle = mainContent.querySelector("#appMenuToggle");
    const appNav = mainContent.querySelector(".app-nav");

    if (menuToggle && appNav) {
      menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = appNav.classList.contains("show");

        if (isOpen) {
          // Close menu
          appNav.classList.remove("show");
          menuToggle.classList.remove("active");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
          document.body.style.overflow = "";
        } else {
          // Open menu
          appNav.classList.add("show");
          menuToggle.classList.add("active");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
          }
          document.body.style.overflow = "hidden";
        }
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !appNav.contains(e.target)) {
          appNav.classList.remove("show");
          menuToggle.classList.remove("active");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
          document.body.style.overflow = "";
        }
      });
    }
  }
}
```

## Features

### Responsive Design

- Desktop: Horizontal navigation with centered links
- Tablet/Mobile: Collapsible hamburger menu
- Smooth animations and transitions

### User Profile Integration

- Displays user initial in circular profile icon
- Logout button with icon
- Profile icon click shows user information

### Active Link Highlighting

- Automatically highlights current page in navigation
- Updates based on current URL hash

### Mobile Menu Functionality

- Hamburger menu icon transforms to X when open
- Menu slides down with animation
- Closes when clicking outside or on navigation links
- Prevents body scrolling when menu is open

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid support required
- FontAwesome icons required for menu toggle and logout button

## Dependencies

- FontAwesome (for icons)
- CSS Grid support
- ES6 modules support

## Maintenance

When adding new pages:

1. Import the NavigationBar component
2. Add navigation rendering to the page's render method
3. Set up navigation events in the afterRender method
4. Update navigation items if needed

The component is designed to be self-contained and reusable across all authenticated pages in the AgriEdu application.

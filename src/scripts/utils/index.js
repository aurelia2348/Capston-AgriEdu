/**
 * Utility functions for the application
 */

/**
 * Create an element with attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - The attributes to set on the element
 * @param {Array|string} children - The children to append to the element
 * @returns {HTMLElement} - The created element
 */
export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === 'events') {
      Object.entries(value).forEach(([eventName, handler]) => {
        element.addEventListener(eventName, handler);
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  // Append children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else {
        element.appendChild(document.createTextNode(child));
      }
    });
  } else {
    element.innerHTML = children;
  }

  return element;
};

/**
 * Format a date
 * @param {Date|string} date - The date to format
 * @param {string} format - The format to use
 * @returns {string} - The formatted date
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate a password
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

/**
 * Get a value from local storage
 * @param {string} key - The key to get
 * @param {*} defaultValue - The default value to return if the key doesn't exist
 * @returns {*} - The value from local storage
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set a value in local storage
 * @param {string} key - The key to set
 * @param {*} value - The value to set
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

/**
 * Remove a value from local storage
 * @param {string} key - The key to remove
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};
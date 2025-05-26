import CONFIG from "../config.js";
import authService from "./auth-service.js";

const createHeaders = (includeAuth = false) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (includeAuth) {
    const token = authService.getToken();
    console.log("Token untuk Authorization:", token);
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
};

export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export async function getData(endpoint, requiresAuth = false) {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const options = {
    method: "GET",
    headers: createHeaders(requiresAuth),
  };

  return apiRequest(url, options);
}

export async function postData(endpoint, data, requiresAuth = false) {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const options = {
    method: "POST",
    headers: createHeaders(requiresAuth),
    body: JSON.stringify(data),
  };

  return apiRequest(url, options);
}

export async function updateData(endpoint, data, requiresAuth = true) {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const options = {
    method: "PUT",
    headers: createHeaders(requiresAuth),
    body: JSON.stringify(data),
  };

  return apiRequest(url, options);
}

export async function deleteData(endpoint, requiresAuth = true) {
  const url = `${CONFIG.BASE_URL}${endpoint}`;
  const options = {
    method: "DELETE",
    headers: createHeaders(requiresAuth),
  };

  return apiRequest(url, options);
}

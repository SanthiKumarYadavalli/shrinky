
import { 
  Link, 
  ClickData, 
  CreateLinkParams 
} from "../types";


export const API_URL = "https://shrinkee.vercel.app"
export const WS_URL = "ws://shrinkee.vercel.app"

// Login
export const login = async (email: string, password: string): Promise<{ token: string }> => {
  console.log(email, password);
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  const data = await response.json();
  return { token: data.token };
};

// Fetch links
export const fetchLinks = async (token: string): Promise<Link[]> => {
  const response = await fetch(`${API_URL}/url/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }
  const data = await response.json();
  return data;
};

// get link by id
export const getLinkById = async (linkId: string, token: string): Promise<Link> => {
  const response = await fetch(`${API_URL}/url/${linkId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }); 
  if (!response.ok) {
    throw new Error("Failed to get link by id");
  }
  const data = await response.json();
  return data;
};  

// shorten url
export const shortenUrl = async (params: CreateLinkParams, token: string): Promise<Link> => {
  const response = await fetch(`${API_URL}/url/`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }
  return data;
};

// delete link
export const deleteLink = async (linkId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/url/${linkId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to delete link");
  }
};

// get analytics
export const getLinkAnalytics = async (linkId: string, token: string): Promise<ClickData[]> => {
  const response = await fetch(`${API_URL}/clickdata/${linkId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch link analytics");
  }
  const data = await response.json();
  return data;
};

const api = {};
export default api;
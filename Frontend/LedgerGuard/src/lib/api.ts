import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "/api";

export const TOKEN_KEY = "dispute_token";
export const USER_KEY = "dispute_user";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    let message: string =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong";
    if (status === 403) message = "You don't have permission to do that";
    else if (status === 500) message = "Server error — please try again";
    return Promise.reject(new Error(message));
  }
);

export type Role = "Customer" | "Admin";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface Transaction {
  id: string;
  reference?: string;
  amount: number;
  currency?: string;
  status: string;
  description?: string;
  merchant?: string;
  date?: string;
  createdAt?: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  reason: string;
  description: string;
  status: string;
  createdAt?: string;
  date?: string;
  assignedAdminId?: string | null;
  notes?: { id: string; text: string; createdAt?: string }[];
  userEmail?: string;
}
import type { Expense, ExpenseInput } from "../types";

export const tokenKey = "expense_tracker_token";

const baseURL =
  (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "https://ndinda-expense-tracker.onrender.com/api";

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem(tokenKey);
  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Request failed: ${response.status}`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
};

export const register = async (name: string, email: string, password: string) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const login = async (email: string, password: string) =>
  request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getExpenses = async () => request<Expense[]>("/expenses");
export const addExpense = async (expense: ExpenseInput) =>
  request<Expense>("/expenses", { method: "POST", body: JSON.stringify(expense) });
export const updateExpense = async (id: string, expense: ExpenseInput) =>
  request<Expense>(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(expense) });
export const removeExpense = async (id: string) =>
  request<void>(`/expenses/${id}`, { method: "DELETE" });

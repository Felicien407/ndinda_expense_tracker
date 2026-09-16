import axios from "axios";
import type { Expense, ExpenseInput } from "../types";

export const tokenKey = "expense_tracker_token";

const api = axios.create({
  baseURL: import.meta.env.API_URL || "https://ndinda-expense-tracker.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = async (name: string, email: string, password: string) =>
  (await api.post("/auth/register", { name, email, password })).data;

export const login = async (email: string, password: string) =>
  (await api.post<{ token: string }>("/auth/login", { email, password })).data;

export const getExpenses = async () => (await api.get<Expense[]>("/expenses")).data;
export const addExpense = async (expense: ExpenseInput) =>
  (await api.post<Expense>("/expenses", expense)).data;
export const updateExpense = async (id: string, expense: ExpenseInput) =>
  (await api.put<Expense>(`/expenses/${id}`, expense)).data;
export const removeExpense = async (id: string) => api.delete(`/expenses/${id}`);

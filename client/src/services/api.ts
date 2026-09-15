import axios from "axios";
import type { Expense, ExpenseInput } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getExpenses = async () => (await api.get<Expense[]>("/expenses")).data;
export const addExpense = async (expense: ExpenseInput) =>
  (await api.post<Expense>("/expenses", expense)).data;
export const removeExpense = async (id: string) => api.delete(`/expenses/${id}`);

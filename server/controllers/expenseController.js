import mongoose from "mongoose";
import Expense from "../models/Expense.js";

const databaseUnavailable = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: "Database is not connected" });
    return true;
  }
  return false;
};

export const getExpenses = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expense = await Expense.create(req.body);
  res.status(201).json(expense);
};

export const deleteExpense = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json({ message: "Expense deleted" });
};

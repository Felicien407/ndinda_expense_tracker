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
  const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expense = await Expense.create({ ...req.body, userId: req.user.id });
  res.status(201).json(expense);
};

export const updateExpense = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    {
    new: true,
    runValidators: true,
    },
  );
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json(expense);
};

export const deleteExpense = async (req, res) => {
  if (databaseUnavailable(res)) return;
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json({ message: "Expense deleted" });
};

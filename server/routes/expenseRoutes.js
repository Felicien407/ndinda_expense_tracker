import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
} from "../controllers/expenseController.js";

const router = Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);

export default router;

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addExpense,
  getExpenses,
  removeExpense,
  tokenKey,
  updateExpense,
} from "./services/api";
import Auth from "./Auth";
import type { Expense, ExpenseInput } from "./types";

const emptyForm: ExpenseInput = {
  title: "",
  amount: 0,
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "RWF",
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem(tokenKey)),
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading expenses...");

  useEffect(() => {
    if (!isAuthenticated) return;

    setMessage("Loading expenses...");
    getExpenses()
      .then((data) => {
        setExpenses(data);
        setMessage("");
      })
      .catch(() => setMessage("Connect MongoDB to load saved expenses."));
  }, [isAuthenticated]);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  if (!isAuthenticated) {
    return <Auth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setExpenses([]);
    setForm(emptyForm);
    setEditingId(null);
    setIsAuthenticated(false);
  };

  const updateForm = (field: keyof ExpenseInput, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editingId) {
        const updated = await updateExpense(editingId, form);
        setExpenses((current) =>
          current.map((expense) =>
            expense._id === editingId ? updated : expense,
          ),
        );
        setMessage("Expense updated.");
      } else {
        const created = await addExpense(form);
        setExpenses((current) => [created, ...current]);
        setMessage("Expense added.");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setMessage("Could not save expense. Check the API and MongoDB.");
    }
  };

  const editExpense = (expense: Expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10),
      notes: expense.notes || "",
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  const deleteExpense = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await removeExpense(id);
      setExpenses((current) => current.filter((expense) => expense._id !== id));
      if (editingId === id) cancelEdit();
      setMessage("Expense deleted.");
    } catch {
      setMessage("Could not delete expense.");
    }
  };

  return (
    <main className="app-shell">
      <header className="header">
        <div>
          <p className="eyebrow">Personal finance</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">Keep your everyday spending simple and visible.</p>
        </div>
        <div className="header-actions">
          <div className="total-card">
            <span>Total spent</span>
            <strong>{money.format(total)}</strong>
          </div>
          <button className="logout-button" type="button" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="layout">
        <section className="panel">
          <h2>{editingId ? "Edit expense" : "Add an expense"}</h2>
          <form onSubmit={submitExpense}>
            <label>Title<input required value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Coffee" /></label>
            <label>Amount<input required min="0" step="0.01" type="number" value={form.amount || ""} onChange={(event) => updateForm("amount", Number(event.target.value))} placeholder="0.00" /></label>
            <label>Category<select value={form.category} onChange={(event) => updateForm("category", event.target.value)}><option>Food</option><option>Transport</option><option>Bills</option><option>Shopping</option><option>Other</option></select></label>
            <label>Date<input required type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} /></label>
            <label>Notes<textarea value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Optional note" rows={3} /></label>
            <button type="submit">{editingId ? "Save changes" : "Add expense"}</button>
            {editingId && <button className="cancel-button" type="button" onClick={cancelEdit}>Cancel</button>}
          </form>
        </section>

        <section className="panel">
          <div className="section-heading"><h2>Recent expenses</h2><span>{expenses.length} items</span></div>
          {message && <p className="message">{message}</p>}
          {expenses.length === 0 && !message ? <p className="empty">No expenses yet.</p> : <div className="expense-list">{expenses.map((expense) => <article className="expense-row" key={expense._id}><div><strong>{expense.title}</strong><span>{expense.category} · {new Date(expense.date).toLocaleDateString()}</span>{expense.notes && <small className="expense-note">Note: {expense.notes}</small>}</div><div className="row-end"><strong>{money.format(expense.amount)}</strong><button className="edit-button" type="button" onClick={() => editExpense(expense)}>Edit</button><button className="delete-button" type="button" onClick={() => deleteExpense(expense._id)} aria-label={`Delete ${expense.title}`}>×</button></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}

export default App;

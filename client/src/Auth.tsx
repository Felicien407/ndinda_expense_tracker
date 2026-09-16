import axios from "axios";
import { useState, type FormEvent } from "react";
import { login, register, tokenKey } from "./services/api";

type AuthMode = "login" | "signup";

type AuthProps = {
  onAuthenticated: () => void;
};

function Auth({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        }

        await register(name, email, password);
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setMessage("Account created. Please log in to continue.");
        return;
      }

      const response = await login(email, password);
      localStorage.setItem(tokenKey, response.token);
      onAuthenticated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Authentication failed. Try again.");
      } else {
        setMessage("Could not connect to the server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Personal finance</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="subtitle">
          {mode === "login"
            ? "Sign in to view your expense dashboard."
            : "Start tracking your spending in RWF."}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Authentication pages">
          <button
            className={mode === "login" ? "active-tab" : ""}
            type="button"
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active-tab" : ""}
            type="button"
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Name
              <input required value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          )}
          <label>
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {mode === "signup" && (
            <label>
              Confirm password
              <input required minLength={6} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
          )}
          {message && <p className="auth-error">{message}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Auth;

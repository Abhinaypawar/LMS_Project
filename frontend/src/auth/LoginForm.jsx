
import { useState, useContext } from "react";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css"; // <-- CSS import

const LoginForm = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      loginUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          New user?{" "}
          <Link to="/signup" className="signup-link">
            Signup here
          </Link>
        </p>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

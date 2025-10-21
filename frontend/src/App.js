import { Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./auth/SignupForm";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./dashboard/Dashboard"

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
      </Routes>
    </div>
  );
}

export default App;

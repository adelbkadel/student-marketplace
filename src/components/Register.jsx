import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    university: "",
    faculty: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim()) return toast.error("First name is required");
    if (!form.lastName.trim()) return toast.error("Last name is required");
    if (!form.studentId.trim()) return toast.error("Student ID is required");
    if (!form.password.trim()) return toast.error("Password is required");
    if (form.password.length < 4)
      return toast.error("Password must be at least 4 characters");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await axios.post("http://localhost:5000/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        studentId: form.studentId,
        password: form.password,
        university: form.university,
        faculty: form.faculty,
      });

      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h2>Register</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <input
            type="text"
            name="university"
            placeholder="University"
            value={form.university}
            onChange={handleChange}
          />

          <input
            type="text"
            name="faculty"
            placeholder="Faculty / Major"
            value={form.faculty}
            onChange={handleChange}
          />

          <button type="submit">Create Account</button>
        </form>

        <p className="auth-extra">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
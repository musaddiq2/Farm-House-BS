import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!formData.password) errs.password = "Password is required";
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      errs.phone = "Enter a valid 10‑digit phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const config = {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {},
      };

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      const res = await axios.post("http://localhost:5000/api/superadmin/admin", payload, config);
      toast.success(res.data.message || "Admin created successfully");
      // redirect to whatever makes sense; super-admin dashboard for now
      navigate("/super-admin/view-users");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Admin</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}

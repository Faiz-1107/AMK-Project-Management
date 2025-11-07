
import React, { useEffect, useState } from "react";
import api from "../RoleApi";
import '../styles/CustomModal.css';
import { Country, State, City } from "country-state-city";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const CustomModal = ({ onClose, mode = "create", userId = null, initialData = null }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
    organization: "",
    role: "user",
  });

  // Pre-populate when editing
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "user",
      }));
    }
  }, [initialData]);

  // Loading countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states on country change
  useEffect(() => {
    if (formData.country) {
      const countryObj = countries.find(c => c.isoCode === formData.country);
      if (countryObj) {
        setStates(State.getStatesOfCountry(countryObj.isoCode));
      }
    } else {
      setStates([]);
    }
    setCities([]); // reset cities when country changes
  }, [formData.country, countries]);

  // Load cities on state change
  useEffect(() => {
    if (formData.state) {
      setCities(City.getCitiesOfState(formData.country, formData.state));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // All input fields change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toastify function
  const showToast = (message, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      style: {
        background: type === "success" ? "#22c55e" : "#ef4444", 
        color: "#fff",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "10px 18px",
      },
    }).showToast();
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit" && userId) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        const res = await api.put(`/update/${userId}`, updateData, {
          headers: { "Content-Type": "application/json" },
        });
        showToast(res.data?.message || "User updated successfully!", "success");
        onClose();
      } else {
        const res = await api.post("/add", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        showToast(res.data?.message || "User created successfully!", "success");
        onClose();
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Request failed. Check console.", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit User' : 'Add User'}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name <span>*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email <span>*</span></label>
              <input
                type="text"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone <span>*</span></label>
              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country <span>*</span></label>
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State <span>*</span></label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City <span>*</span></label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password <span>*</span></label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required={mode !== 'edit'}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password <span>*</span></label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={mode !== 'edit'}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Organization <span>*</span></label>
              <input
                type="text"
                name="organization"
                placeholder="Enter Organization"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role <span>*</span></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              {mode === 'edit' ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomModal;

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as Yup from "yup";
import { login } from "../store/slice";
import api from "../RoleApi";
import '../styles/Signup.css';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    consent: Yup.boolean()
      .oneOf([true], "You must consent to the Privacy Policy")
      .required("Consent is required"),
  });

  const initialValues = {
    email: "",
    password: "",
    consent: false,
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { consent, ...formData } = values;
      const response = await api.post("/login", formData);

      if (response.data.token && response.data.user) {
        dispatch(login({
          token: response.data.token,
          user: response.data.user
        }));

        Toastify({
          text: response.data.message || "Login successful!",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "#4CAF50",
          stopOnFocus: true,
          className: "toast-success",
        }).showToast();
        resetForm();
        navigate("/dashboard");
      } else {
        alert("Login failed. Invalid response from server.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Invalid email or password!";
      Toastify({
        text: errorMessage,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#FF4C4C", // red for error
        stopOnFocus: true,
        className: "toast-error",
      }).showToast();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="name">Syed Faiz</h1>
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">AlMukarramah</h2>
          <p className="signup-subtitle">Project Management System</p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue, errors, touched }) => (
              <Form className="signup-form">
                <label htmlFor="email">Email Address</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className={errors.email && touched.email ? "error" : ""}
                  disabled={isSubmitting}
                />
                <ErrorMessage name="email" component="div" className="error-message" />

                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="********"
                  className={errors.password && touched.password ? "error" : ""}
                  disabled={isSubmitting}
                />
                <ErrorMessage name="password" component="div" className="error-message" />

                <div className="signup-consent">
                  <Field
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(e) => setFieldValue("consent", e.target.checked)}
                    disabled={isSubmitting}
                  />{" "}
                  <a href="#"> I Consent to the Processing of my personel data according to the Privacy Policy</a>
                </div>
                <ErrorMessage name="consent" component="div" className="error-message" />

                <button type="submit" className="signup-button" disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                <p className="signup-footer">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
        <footer className="signup-footer-text">
          © 2025 AlMukarramah. All rights reserved. | <a href="#">Privacy Policy</a> |{" "}
          <a href="#">Terms of Use</a>
        </footer>
      </div>
    </>
  )
};


export default Signin;

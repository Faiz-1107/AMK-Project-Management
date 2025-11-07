import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../RoleApi";
import '../styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters")
            .required("Full name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .max(50, "Password must be less than 50 characters")
            .required("Password is required"),
        role: Yup.string()
            .oneOf(["user", "admin"], "Invalid role selected")
            .required("Role is required"),
        consent: Yup.boolean()
            .oneOf([true], "You must consent to the Privacy Policy")
            .required("Consent is required"),
    });

    const initialValues = {
        name: "",
        email: "",
        password: "",
        role: "user",
        consent: false,
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const { consent, ...formData } = values;
            console.log("Form data being sent:", formData);
            const response = await api.post("/submit", formData);
            alert(response.data.message);
            resetForm();
            navigate("/");
        } catch (error) {
            console.error("Signup failed:", error);
            alert(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">AlMukarramah</h2>
                <p className="signup-subtitle">Create Your Account</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="signup-form">
                            <label htmlFor="name">Full Name</label>
                            <Field
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                className={errors.name && touched.name ? "error" : ""}
                            />
                            <ErrorMessage name="name" component="div" className="error-message" />

                            <label htmlFor="email">Email Address</label>
                            <Field
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                className={errors.email && touched.email ? "error" : ""}
                            />
                            <ErrorMessage name="email" component="div" className="error-message" />

                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="********"
                                className={errors.password && touched.password ? "error" : ""}
                            />
                            <ErrorMessage name="password" component="div" className="error-message" />

                            <label className="signup-label">Select Role</label>
                            <Field
                                as="select"
                                name="role"
                                className={`signup-input ${errors.role && touched.role ? "error" : ""}`}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Field>
                            <ErrorMessage name="role" component="div" className="error-message" />

                            <div className="signup-consent">
                                <Field
                                    type="checkbox"
                                    name="consent"
                                    checked={values.consent}
                                    onChange={(e) => setFieldValue("consent", e.target.checked)}
                                />{" "}
                                <a href="#">I Consent to the Processing of my personel data according to the Privacy Policy</a>
                            </div>
                            <ErrorMessage name="consent" component="div" className="error-message" />

                            <button type="submit" className="signup-button" disabled={isSubmitting}>
                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </button>

                            <p className="signup-footer">
                                Already have an account? <Link to="/">Sign In</Link>
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
    );
};

export default Signup;
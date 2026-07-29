import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../services/userServces";


function Login() {
    const navigate = useNavigate();
    // Handle form data
    const [formData, setFormData] = useState({
        email: "",
        password: ""

    })
    // Show errors
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle form changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value,
        })

    }
    // Loading
    const [loading, setLoading] = useState(false);

    // Handle error feedbacks
    const validate = () => {
        const { email, password } = formData;
        const newErrors = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            newErrors.email = "Email address is invalid";
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            .test(password.trim())) {
            newErrors.password = "Password must be 8+ characters with lowercase, uppercase, number and symbol";
        }

        setFieldErrors(newErrors);
        return Object.values(newErrors).length === 0;


    }
    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        setLoading(true);
        // Submit user data to the backend api
        try {
            const response = await login(formData);
            toast.success(response.data.message);

            setFormData({
                email: "",
                password: ""
            });
            setFieldErrors({});
            // Redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            const backendMessage = error?.response?.data;
            if (backendMessage?.errors) {
                // Handle validation errors from backend
                const mappedErrors = {};
                backendMessage.errors.forEach((err) => {
                    mappedErrors[err.field] = err.message;
                    
                }); 
                setFieldErrors(mappedErrors);
            } else {
                toast.error(backendMessage?.message || "Internal server error. Please try again later.");
            }

        } finally {
            setLoading(false);
        }

    };


    return (
        <FormContainer title="Welcome back!" subtitle="Enter your details to continue">
            <form onSubmit={handleSubmit} noValidate>

                <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChanges}
                    placeholder="Enter your email address"
                    error={fieldErrors.email}
                />
                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChanges}
                    placeholder="Enter your password"
                    error={fieldErrors.password}

                />
                <Button
                    text={loading ? "..." : "Login"}
                    type="submit"
                    disabled={loading}
                />
                <div className="formFooter">
                    <p> Don't have an account? </p>
                    <Link to="/create-account">Create Account</Link>
                </div>
            </form>

        </FormContainer>
    )
}

export default Login;
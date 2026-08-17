import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "../services/userServces";


function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    // Retrieve token from prev page
    const token = location.state?.token;

    // Protect the route if no token
    useEffect( () => {
        if(!token) {
            toast.error("Unauthorized access");
            navigate("/");
        }
    }, [token, navigate]);

    // Handle form data
    const [data, setData] = useState({ password: "" });
    // Show errors
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle form changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setData({
            ...data, [name]: value,
        });

    }
    // Loading
    const [loading, setLoading] = useState(false);

    // Handle error feedbacks
    const validate = () => {
        const { password } = data;
        const newErrors = {};

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
            const response = await resetPassword({token, password: data.password});
            toast.success(response.data.message);

            setData({
                password: ""
            });
            setFieldErrors({});
            // Redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            if (!error.response) {
                toast.error("Network error. Please ensure the server is running and try again.");
                return;
            }
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
        <>
            <FormContainer title="Reset Your password" subtitle=" Create a strong new password">
                <form onSubmit={handleSubmit} noValidate >
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChanges}
                        placeholder="Enter your password"
                        error={fieldErrors.password}

                    />

                    <Button
                        text={loading ? "..." : "reset password"}
                        type="submit"
                        disabled={loading}
                    />
                    <div className="formFooter">
                        <p>
                            Return to
                            <Link to="/"> Login</Link>
                        </p>

                        <p> Don't have an account?
                            <Link to="/create-account"> Create Account</Link>

                        </p>

                    </div>
                </form>
            </FormContainer>
        </>
    )
}
export default ResetPassword;
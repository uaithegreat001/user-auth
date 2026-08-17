import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/userServces";




function ForgotPassword() {
    const navigate = useNavigate();
    // Handle form data
    const [data, setData] = useState({ email: "" });
    // Show errors
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle form changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setData({
            ...data, [name]: value,
        });

    };
    const validate = () => {
        const { email } = data;
        const newErrors = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            newErrors.email = "Email address is invalid";
        }

        setFieldErrors(newErrors);
        return Object.values(newErrors).length === 0;
    };

    // Loading
    const [loading, setLoading] = useState(false);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        setLoading(true);
        // Submit user data to the backend api
        try {
            const response = await forgotPassword(data);
            toast.success(response.data.message);

            setData({
                email: ""
            });
            setFieldErrors({});
            // Redirect to otp
            navigate("/otp", { state: { email: data.email, flow: "FORGOT_PASSWORD"}});
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
        <>
            <FormContainer title="Forgot your password?"
                subtitle="Enter your email address to help you reset it." >
                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={data.email}
                        onChange={handleChanges}
                        error={fieldErrors.email}
                    />

                    <Button
                        text={loading ? "Sending..." : "Continue"}
                        type="submit"
                        disabled={loading}
                    />
                    <div className="formFooter">
                        <p> Return to <Link to="/"> Login</Link></p>

                        <p> Don't have an account?<Link to="/create-account"> Create Account</Link>

                        </p>

                    </div>

                </form>
            </FormContainer>

        </>

    )
}

export default ForgotPassword;
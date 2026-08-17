import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAccount } from "../services/userServces";
import { Navigate } from "react-router-dom";


function CreateAccount() {
    const navigate = useNavigate();
    // Handle form data
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""

    })
    // Show errors
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle form changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setData({
            ...data, [name]: value,
        })

    }
    // Loading
    const [loading, setLoading] = useState(false);


    // Handle error feedbacks
    const validate = () => {
        const { name, email, password } = data;
        const newErrors = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (name.trim().length > 50) {
            newErrors.name = "Name must be at most 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            newErrors.name = "Name is invalid";
        }

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
            const response = await createAccount(data);
            toast.success(response.data.message);

            setData({
                name: "",
                email: "",
                password: ""
            });
            setFieldErrors({});
            // Redirect to OTP page

            navigate("/otp", { state: { email: response.data.data.email, flow: "CREATE_ACCOUNT" } });

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
        <FormContainer title="Create your account" subtitle="Fill in the details to continue">
            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    label="Full Name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChanges}
                    placeholder="Enter your full name"
                    error={fieldErrors.name}

                />
                <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChanges}
                    placeholder="Enter your email address"
                    error={fieldErrors.email}
                />
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
                    text={loading ? "..." : "Continue"}
                    type="submit"
                    disabled={loading}
                />
                <div className="formFooter">
                    <p> Already have an account? <Link to="/"> Login</Link> </p>
                </div> <hr />
                  <div className="termsOfUse">
                    By continuing you agree with our 
                    <span>Terms of use</span> and 
                    <span>Privacy policy.</span>
                </div>
            </form>

        </FormContainer>
    )
}

export default CreateAccount;
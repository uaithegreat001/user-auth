import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";


function Login() {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log("form Submitted");
    }


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
                <Button text="Login" type="submit" />
                <div className="formFooter">
                    <p> Don't have an account? </p>
                    <Link to="/create-account">Create Account</Link>
                </div>
            </form>

        </FormContainer>
    )
}

export default Login;
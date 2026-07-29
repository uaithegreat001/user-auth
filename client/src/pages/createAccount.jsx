import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";


function CreateAccount() {
    // Handle form data
    const [formData, setFormData] = useState({
        name: "",
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
        const { name, email, password } = formData;
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
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log("form Submitted");
    }


    return (
        <FormContainer title="it's free! join now" subtitle="Fill the details to create account">
            <form onSubmit={handleSubmit} noValidate>
                <InputField
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChanges}
                    placeholder="Enter your full name"
                    error={fieldErrors.name}

                />
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
                <Button text="Create Account" type="submit" />
                <div className="formFooter">
                    <p> Already have an account? </p>
                    <Link to="/">Login</Link>
                </div>
            </form>

        </FormContainer>
    )
}

export default CreateAccount;
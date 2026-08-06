import { useEffect, useState } from "react";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUserCreateAccount} from "../services/userServces";
import toast from "react-hot-toast";



function OTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // handle form data
    const [formData, setFormData] = useState({
        code: ""
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Navigate user back if account not created
    useEffect(() => {
        if (!email) {
            toast.error("Please create account first");
            navigate("/create-account");
        }
    }, [email, navigate]);

    // Handle form changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    };

    // Handle error feedbacks
    const validate = () => {
        const newErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = "Verification code is required";
        } else if (!/^\d{6}$/.test(formData.code.trim())) {
            newErrors.formData.code = "Verification code must be 6 digits"
        };

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
            const response = await verifyUserCreateAccount({
                email,
                code: formData.code.trim()
            });

            toast.success(response.data.message);

            // Redirect to OTP page
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
                    if(err.field === "code") {
                        mappedErrors.code = err.message;
                    }
                });

                setFieldErrors(mappedErrors);

            } else {
                toast.error(backendMessage?.message || "Unable to verify account. Please try again.");
            }

        } finally {
            setLoading(false);
        }

    }


    return (
        <>
            <FormContainer title="Account Verification" subtitle="Check your email otp code is sent"  >
                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        label= "Verification code"
                        type="text"
                        name="code"
                        placeholder="Enter 6-digits OTP"
                        value={formData.code}
                        onChange={handleChanges}
                        error={fieldErrors.code}
                        
                    />           

                    <Button
                        text={loading ? "Verifying..." : "Verify Account"}
                        type="submit"
                        disabled={loading}

                    />

                </form>

            </FormContainer>

        </>
    )
}

export default OTP;
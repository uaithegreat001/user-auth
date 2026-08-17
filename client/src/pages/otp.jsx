import { useEffect, useState } from "react";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    verifyCreateAccount, 
    verifyLogin, 
    verifyResetPassword, 
    resendCodeTOCreateAccount,
    resendCodeTOLogin,
    resendCodeTOResetPassword 
} from "../services/userServces";
import toast from "react-hot-toast";



function OTP() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract data from previous page
    const { email, flow } = location.state || {};

    // handle form data
    const [data, setData] = useState({
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
        setData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    };

    // Handle error feedbacks
    const validate = () => {
        const newErrors = {};

        if (!data.code.trim()) {
            newErrors.code = "Verification code is required";
        } else if (!/^\d{6}$/.test(data.code.trim())) {
            newErrors.data.code = "Verification code must be 6 digits"
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
            let response;
            switch (flow) {

                case "CREATE_ACCOUNT":
                    response = await verifyCreateAccount({ email, code: data.code.trim() })
                    toast.success(response.data.message);
                    // Redirect to dashboard
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                    break;

                case "LOGIN":
                    response = await verifyLogin({ email, code: data.code.trim() })
                    toast.success(response.data.message);
                    // Redirect to dashboard
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                    break;

                case "FORGOT_PASSWORD":
                    response = await verifyResetPassword({ email, code: data.code.trim() });
                    toast.success(response.data.message);

                    // Getting the token from backend api response
                    const token = response.data.data.resetToken;
                    // Redirect to reset password
                    setTimeout(() => {
                        navigate('/resetPassword', { state: { token } });
                    }, 2000);
                    break;

                default:
                    toast.error("Invalid OTP routing.");
                    navigate("/"); // Fallback if someone manually visits /otp   

            };
        } catch (error) {
            const backendMessage = error?.response?.data;

            if (backendMessage?.errors) {
                // Handle validation errors from backend
                const mappedErrors = {};

                backendMessage.errors.forEach((err) => {
                    mappedErrors[err.field] = err.message;
                    if (err.field === "code") {
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
    };
    
    // Handle resend otp code
    const handleResendCode = async (e) => {
        e.preventDefault();
        try {
            let response;
            switch(flow) {
                case "CREATE_ACCOUNT": 
                response = await resendCodeTOCreateAccount({email});
                toast.success("Code sent successifully");
                break;

                case "LOGIN": 
                response = await resendCodeTOLogin({email});
                toast.success("Code sent successifully");
                break;

                case "FORGOT_PASSWORD":
                response = await resendCodeTOLogin({email});
                toast.success("Code sent successifully");
                break;                
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send code");
        }
    };

    return (
        <>
            <FormContainer title="Account Verification" subtitle="Code sent to your email. Check! "  >
                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        label="Verification code"
                        type="text"
                        name="code"
                        placeholder="Enter 6-digits code"
                        value={data.code}
                        onChange={handleChanges}
                        error={fieldErrors.code}

                    />
                    <div className="resend-otp">
                        <p>Did'nt recieve code?
                            <button onClick={handleResendCode}>Resend</button>
                        </p>
                    </div>

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

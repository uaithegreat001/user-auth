import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/createAccount"
import { Toaster } from "react-hot-toast"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard";
import OTP from "./pages/otp";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-center" 
    toastOptions={{
      style: {
        boxShadow: "none",
        fontSize: "0.8rem",
        fontWeight: 600,
      },
      error: {style:{border:"1px solid rgb(85, 85, 102, 0.3)"}},
      success: {style:{border:"1px solid rgb(85, 85, 102, 0.3)"}}
    }}
    />
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/otp" element = {<OTP/>} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      
    </BrowserRouter>
  )
}


export default App
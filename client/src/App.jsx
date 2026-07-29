import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/createAccount"
import Login from "./pages/login"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  )
}


export default App
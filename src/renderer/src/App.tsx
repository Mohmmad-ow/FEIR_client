import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./authentication/sign-in";
import Signup from "./authentication/sing-up";
import ForgotPassword from "./authentication/forgot-password";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

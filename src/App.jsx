import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={    <AuthProvider><AdminRoutes /></AuthProvider>} />
      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        return <Navigate to="/users/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/events" replace />;
    }

    return children;
}

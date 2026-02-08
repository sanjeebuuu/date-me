// for protected routes used in App.jsx


import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    // If there is no token, redirect to login
    if (!token) {
        alert("Please Login First")
        return <Navigate to="/" replace />;
    }

    // If there is a token, render the "Outlet" (the child component)
    return <Outlet />;
};

export default ProtectedRoute;
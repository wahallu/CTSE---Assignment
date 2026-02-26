import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="logo">
                    🎪 <span>EventHub</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/events">Events</Link>
                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Link to="/admin">Admin</Link>
                            )}
                            <Link to="/my-tickets">My Tickets</Link>
                            <div className="user-menu">
                                <span className="user-greeting">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/users/login">Login</Link>
                            <Link to="/users/register" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
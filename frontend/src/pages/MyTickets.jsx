import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTicketsByUser, updateTicket } from "../services/ticketService";

export default function MyTickets() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/users/login");
            return;
        }

        const fetchTickets = async () => {
            try {
                const res = await getTicketsByUser(user._id);
                setTickets(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleCancel = async (ticketId) => {
        if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

        try {
            await updateTicket(ticketId, { status: "cancelled" });
            setTickets((prev) =>
                prev.map((t) => (t._id === ticketId ? { ...t, status: "cancelled" } : t))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const statusBadge = (status) => {
        const map = {
            booked: "badge-success",
            pending: "badge-warning",
            cancelled: "badge-danger",
        };
        return `badge ${map[status] || "badge-warning"}`;
    };

    if (loading) {
        return (
            <div className="page-center">
                <div className="spinner" />
                <p>Loading your tickets…</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>My Tickets Here</h1>
                    <p className="page-subtitle">Manage your event bookings</p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {tickets.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🎫</span>
                    <h2>No tickets yet</h2>
                    <p>Browse events and book your first ticket!</p>
                    <Link to="/events" className="btn btn-primary">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="tickets-list">
                    {tickets.map((ticket) => (
                        <div key={ticket._id} className="ticket-card">
                            <div className="ticket-left">
                                <div className="ticket-info">
                                    <span className="ticket-label">Ticket ID</span>
                                    <span className="ticket-id mono">{ticket._id}</span>
                                </div>
                                <div className="ticket-meta">
                                    <div className="ticket-info">
                                        <span className="ticket-label">Seats</span>
                                        <span>{ticket.seatCount}</span>
                                    </div>
                                    <div className="ticket-info">
                                        <span className="ticket-label">Price</span>
                                        <span>${ticket.price.toFixed(2)}</span>
                                    </div>
                                    <div className="ticket-info">
                                        <span className="ticket-label">Booked</span>
                                        <span>
                                            {new Date(ticket.bookingDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="ticket-info">
                                        <span className="ticket-label">Status</span>
                                        <span className={statusBadge(ticket.status)}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-actions">
                                {ticket.status === "pending" && (
                                    <Link
                                        to={`/payment/${ticket._id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Pay Now
                                    </Link>
                                )}
                                {ticket.status !== "cancelled" && (
                                    <button
                                        onClick={() => handleCancel(ticket._id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

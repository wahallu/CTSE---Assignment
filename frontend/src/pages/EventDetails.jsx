import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await getEventById(id);
                setEvent(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="page-center">
                <div className="spinner" />
                <p>Loading event…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="alert alert-error">{error}</div>
                <Link to="/events" className="btn btn-outline">← Back to Events</Link>
            </div>
        );
    }

    if (!event) return null;

    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const eventTime = new Date(event.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const soldOut = event.availableSeats === 0;

    return (
        <div className="page">
            <Link to="/events" className="back-link">← Back to Events</Link>

            <div className="detail-card">
                <div className="detail-header">
                    <h1>{event.name}</h1>
                    {soldOut ? (
                        <span className="badge badge-danger badge-lg">Sold Out</span>
                    ) : (
                        <span className="badge badge-success badge-lg">Available</span>
                    )}
                </div>

                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">📍 Location</span>
                        <span className="detail-value">{event.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">📅 Date</span>
                        <span className="detail-value">{eventDate}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">🕐 Time</span>
                        <span className="detail-value">{eventTime}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">💺 Available Seats</span>
                        <span className="detail-value">{event.availableSeats}</span>
                    </div>
                </div>

                {!soldOut && (
                    <div className="detail-actions">
                        <Link to={`/booking/${event._id}`} className="btn btn-primary btn-lg">
                            Book Tickets
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

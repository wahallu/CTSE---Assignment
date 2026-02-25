import { Link } from "react-router-dom";

export default function EventCard({ event }) {
    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const eventTime = new Date(event.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const seatsLow = event.availableSeats <= 10 && event.availableSeats > 0;
    const soldOut = event.availableSeats === 0;

    return (
        <div className="event-card">
            <div className="event-card-badge">
                {soldOut ? (
                    <span className="badge badge-danger">Sold Out</span>
                ) : seatsLow ? (
                    <span className="badge badge-warning">Few Left</span>
                ) : (
                    <span className="badge badge-success">Available</span>
                )}
            </div>

            <div className="event-card-body">
                <h3 className="event-card-title">{event.name}</h3>

                <div className="event-card-details">
                    <div className="event-detail">
                        <span className="event-detail-icon">📍</span>
                        <span>{event.location}</span>
                    </div>
                    <div className="event-detail">
                        <span className="event-detail-icon">📅</span>
                        <span>{eventDate}</span>
                    </div>
                    <div className="event-detail">
                        <span className="event-detail-icon">🕐</span>
                        <span>{eventTime}</span>
                    </div>
                    <div className="event-detail">
                        <span className="event-detail-icon">💺</span>
                        <span>
                            {soldOut
                                ? "No seats available"
                                : `${event.availableSeats} seats available`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="event-card-actions">
                <Link to={`/events/${event._id}`} className="btn btn-outline">
                    View Details
                </Link>
                {!soldOut && (
                    <Link to={`/booking/${event._id}`} className="btn btn-primary">
                        Book Now
                    </Link>
                )}
            </div>
        </div>
    );
}

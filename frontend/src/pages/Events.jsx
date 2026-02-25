import { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService";
import EventCard from "../components/EventCard";

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await getAllEvents();
                setEvents(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filtered = events.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-center">
                <div className="spinner" />
                <p>Loading events…</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Upcoming Events</h1>
                    <p className="page-subtitle">Discover and book amazing events near you</p>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search events…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🎭</span>
                    <h2>No events found</h2>
                    <p>Check back later for upcoming events</p>
                </div>
            ) : (
                <div className="events-grid">
                    {filtered.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/booking/:eventId" element={<Booking />} />
          <Route path="/payment/:ticketId" element={<Payment />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
import api from "./api";

const BASE = "/api/tickets";

/** POST /api/tickets */
export const createTicket = async (ticketData) => {
    const { data } = await api.post(BASE, ticketData);
    return data;
};

/** GET /api/tickets */
export const getAllTickets = async (filters = {}) => {
    const { data } = await api.get(BASE, { params: filters });
    return data;
};

/** GET /api/tickets/:id */
export const getTicketById = async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
};

/** GET /api/tickets/user/:userId */
export const getTicketsByUser = async (userId) => {
    const { data } = await api.get(`${BASE}/user/${userId}`);
    return data;
};

/** PUT /api/tickets/:id */
export const updateTicket = async (id, ticketData) => {
    const { data } = await api.put(`${BASE}/${id}`, ticketData);
    return data;
};

/** DELETE /api/tickets/:id */
export const deleteTicket = async (id) => {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
};

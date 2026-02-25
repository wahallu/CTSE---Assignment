import api from "./api";

const BASE = "/api/events";

/** GET /api/events */
export const getAllEvents = async () => {
    const { data } = await api.get(BASE);
    return data;
};

/** GET /api/events/:id */
export const getEventById = async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
};

/** POST /api/events */
export const createEvent = async (eventData) => {
    const { data } = await api.post(BASE, eventData);
    return data;
};

/** PUT /api/events/:id */
export const updateEvent = async (id, eventData) => {
    const { data } = await api.put(`${BASE}/${id}`, eventData);
    return data;
};

/** DELETE /api/events/:id */
export const deleteEvent = async (id) => {
    const { data } = await api.delete(`${BASE}/${id}`);
    return data;
};

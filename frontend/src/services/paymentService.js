import api from "./api";

const BASE = "/payments";

/**
 * Create / simulate a payment.
 * POST /api/payments
 */
export const createPayment = async (paymentData) => {
    const { data } = await api.post(BASE, paymentData);
    return data;
};

/** GET /api/payments/:id */
export const getPaymentById = async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
};

/** GET /api/payments/user/:userId */
export const getPaymentsByUser = async (userId) => {
    const { data } = await api.get(`${BASE}/user/${userId}`);
    return data;
};

import api from "./api";

const BASE = "/api/users";

/**
 * Register a new user.
 * POST /api/users/register
 */
export const registerUser = async ({ name, email, password }) => {
    const { data } = await api.post(`${BASE}/register`, {
        name,
        email,
        password,
    });
    return data;
};

/**
 * Login an existing user.
 * POST /api/users/login
 */
export const loginUser = async ({ email, password }) => {
    const { data } = await api.post(`${BASE}/login`, { email, password });
    return data;
};

/**
 * Get user profile by ID.
 * GET /api/users/:id
 */
export const getUserById = async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
};

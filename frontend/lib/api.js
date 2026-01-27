const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Auth
export const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
};

export const register = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return res.json();
};

export const getMe = async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

// Menu
export const getAllMenu = async () => {
    try {
        const url = `${API_URL}/menu`;
        console.log('Fetching menu from:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error('Error in getAllMenu:', error);
        throw error;
    }
};

export const getFeaturedMenu = async () => {
    const res = await fetch(`${API_URL}/menu/featured`);
    return res.json();
};

export const getMenuByCategory = async (categoryId) => {
    const res = await fetch(`${API_URL}/menu/category/${categoryId}`);
    return res.json();
};

// Categories
export const getAllCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
};

// Orders
export const createOrder = async (orderData, token) => {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });
    return res.json();
};

export const getMyOrders = async (token) => {
    const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

// Reservations
export const createReservation = async (reservationData, token) => {
    const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
    });
    return res.json();
};

export const getMyReservations = async (token) => {
    const res = await fetch(`${API_URL}/reservations/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

// Testimonials
export const getTestimonials = async () => {
    const res = await fetch(`${API_URL}/testimonials`);
    return res.json();
};

export const createTestimonial = async (testimonialData, token) => {
    const res = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testimonialData),
    });
    return res.json();
};

// Stats (Admin)
export const getStats = async (token) => {
    const res = await fetch(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

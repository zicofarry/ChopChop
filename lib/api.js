const API_URL = '/api';

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

export const getAllMenu = async (cafe) => {
    try {
        const params = cafe ? `?cafe=${cafe}` : '';
        const url = `${API_URL}/menu${params}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
        return res.json();
    } catch (error) {
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

export const getAllCategories = async (cafe) => {
    const params = cafe ? `?cafe=${cafe}` : '';
    const res = await fetch(`${API_URL}/categories${params}`);
    return res.json();
};

export const getTableByToken = async (token) => {
    const res = await fetch(`${API_URL}/tables/token/${token}`);
    return res.json();
};

export const createGuestOrder = async (orderData) => {
    const res = await fetch(`${API_URL}/orders/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    return res.json();
};

export const getOrderStatus = async (orderId) => {
    const res = await fetch(`${API_URL}/orders/status/${orderId}`);
    return res.json();
};

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

export const getCafeOrders = async (token) => {
    const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const updateOrderStatus = async (orderId, status, token) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    return res.json();
};

export const verifyPayment = async (orderId, token) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/verify-payment`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const simulatePayment = async (orderId) => {
    const res = await fetch(`${API_URL}/payments/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
    });
    return res.json();
};

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

export const getStats = async (token) => {
    const res = await fetch(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const getCafeTables = async (token) => {
    const res = await fetch(`${API_URL}/tables`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const createTable = async (tableData, token) => {
    const res = await fetch(`${API_URL}/tables`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tableData),
    });
    return res.json();
};

export const deleteTable = async (tableId, token) => {
    const res = await fetch(`${API_URL}/tables/${tableId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const getPublicTables = async (slug = 'chopchop') => {
    const res = await fetch(`${API_URL}/tables/cafe/${slug}`);
    return res.json();
};

export const getAllMenuAdmin = async (token) => {
    const res = await fetch(`${API_URL}/menu/admin`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const createMenu = async (menuData, token) => {
    const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(menuData),
    });
    return res.json();
};

export const updateMenu = async (menuId, menuData, token) => {
    const res = await fetch(`${API_URL}/menu/${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(menuData),
    });
    return res.json();
};

export const deleteMenu = async (menuId, token) => {
    const res = await fetch(`${API_URL}/menu/${menuId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const getAllTestimonials = async (token) => {
    const res = await fetch(`${API_URL}/testimonials/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const updateTestimonialApproval = async (testimonialId, approved, token) => {
    const res = await fetch(`${API_URL}/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved }),
    });
    return res.json();
};

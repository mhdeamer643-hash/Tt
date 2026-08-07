const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "حدث خطأ غير متوقع");
  }
  return data;
}

export const api = {
  requestOtp: (phone) => request("/auth/request-otp", { method: "POST", body: { phone } }),
  verifyOtp: (phone, code) => request("/auth/verify-otp", { method: "POST", body: { phone, code } }),

  getCities: () => request("/cities"),
  getAreas: (cityId) => request(`/cities/${cityId}/areas`),

  getRestaurants: (areaId, q) => {
    const params = new URLSearchParams();
    if (areaId) params.set("area_id", areaId);
    if (q) params.set("q", q);
    return request(`/restaurants?${params.toString()}`);
  },
  getRestaurant: (id) => request(`/restaurants/${id}`),

  createOrder: (token, payload) => request("/orders", { method: "POST", body: payload, token }),
  getOrders: (token) => request("/orders", { token }),
  getOrder: (token, id) => request(`/orders/${id}`, { token }),
  advanceOrderStatus: (token, id) => request(`/orders/${id}/advance-status`, { method: "POST", token }),
};

export default api;

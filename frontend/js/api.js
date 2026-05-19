const API_BASE = "http://localhost:5000/api";

async function apiFetch(endpoint, options = {}) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `Bearer ${token}`
                })
            },
            ...options
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "API Error");
        }

        return data;

    } catch (err) {
        console.error("API ERROR:", err);
        showToast(err.message || "Something went wrong");
        throw err;
    }
}
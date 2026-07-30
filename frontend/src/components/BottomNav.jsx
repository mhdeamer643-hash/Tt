import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("rahati_token") || null);
  const [user, setUser] = useState(() => loadJSON("rahati_user", null));
  const [city, setCity] = useState(() => loadJSON("rahati_city", null));
  const [area, setArea] = useState(() => loadJSON("rahati_area", null));
  const [cart, setCart] = useState(() => loadJSON("rahati_cart", { restaurantId: null, restaurantName: null, items: [] }));

  useEffect(() => {
    token ? localStorage.setItem("rahati_token", token) : localStorage.removeItem("rahati_token");
  }, [token]);
  useEffect(() => { localStorage.setItem("rahati_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("rahati_city", JSON.stringify(city)); }, [city]);
  useEffect(() => { localStorage.setItem("rahati_area", JSON.stringify(area)); }, [area]);
  useEffect(() => { localStorage.setItem("rahati_cart", JSON.stringify(cart)); }, [cart]);

  function login(userData, tok) {
    setUser(userData);
    setToken(tok);
  }

  function logout() {
    setUser(null);
    setToken(null);
    setCart({ restaurantId: null, restaurantName: null, items: [] });
  }

  function addToCart(restaurantId, restaurantName, dish) {
    setCart((prev) => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId) {
        return { restaurantId, restaurantName, items: [{ ...dish, quantity: 1 }] };
      }
      const existing = prev.items.find((i) => i.id === dish.id);
      const items = existing
        ? prev.items.map((i) => (i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev.items, { ...dish, quantity: 1 }];
      return { restaurantId, restaurantName, items };
    });
  }

  function updateQuantity(dishId, delta) {
    setCart((prev) => {
      const items = prev.items
        .map((i) => (i.id === dishId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      return { ...prev, items, restaurantId: items.length ? prev.restaurantId : null };
    });
  }

  function clearCart() {
    setCart({ restaurantId: null, restaurantName: null, items: [] });
  }

  const value = {
    token, user, login, logout,
    city, setCity, area, setArea,
    cart, addToCart, updateQuantity, clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp يجب أن يُستخدم داخل AppProvider");
  return ctx;
}

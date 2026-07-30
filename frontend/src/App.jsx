import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import OtpScreen from "./screens/OtpScreen";
import CityScreen from "./screens/CityScreen";
import AreaScreen from "./screens/AreaScreen";
import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import TrackingScreen from "./screens/TrackingScreen";
import OrdersHistoryScreen from "./screens/OrdersHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SupportScreen from "./screens/SupportScreen";

function RequireAuth({ children }) {
  const { token } = useApp();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/login" element={<OtpScreen />} />
      <Route path="/city" element={<RequireAuth><CityScreen /></RequireAuth>} />
      <Route path="/area" element={<RequireAuth><AreaScreen /></RequireAuth>} />
      <Route path="/home" element={<RequireAuth><HomeScreen /></RequireAuth>} />
      <Route path="/restaurant/:id" element={<RequireAuth><RestaurantScreen /></RequireAuth>} />
      <Route path="/cart" element={<RequireAuth><CartScreen /></RequireAuth>} />
      <Route path="/checkout" element={<RequireAuth><CheckoutScreen /></RequireAuth>} />
      <Route path="/tracking/:id" element={<RequireAuth><TrackingScreen /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><OrdersHistoryScreen /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfileScreen /></RequireAuth>} />
      <Route path="/support" element={<SupportScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}
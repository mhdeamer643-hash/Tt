import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useApp } from '../context/AppContext';

export default function RestaurantScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, cartCount } = useApp();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getRestaurant(id)
      .then((res) => {
        setRestaurant(res);
        setActiveCategory(res.menu[0]?.id || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">خطأ: {error}</div>;
  if (!restaurant) return null;

  const currentCategory = restaurant.menu.find(cat => cat.id === activeCategory);

  return (
    <div className="restaurant-screen">
      <div className="header-bar" style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
        <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, margin: '0 auto' }}>{restaurant.name_ar}</h1>
      </div>

      <div className="scroll" style={{ display: 'flex', overflowX: 'auto', padding: '10px 16px', gap: '10px' }}>
        {restaurant.menu.map((cat) => (
          <div 
            key={cat.id} 
            className={`tag-row ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ padding: '8px 16px', background: activeCategory === cat.id ? 'var(--primary)' : '#f2f2f2', color: activeCategory === cat.id ? '#fff' : '#000', borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {cat.name_ar}
          </div>
        ))}
      </div>

      <div className="section-title" style={{ padding: '16px' }}>
        <h2>{currentCategory?.name_ar}</h2>
        {currentCategory?.dishes.map((dish) => (
          <div key={dish.id} className="img-placeholder" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{dish.name_ar}</div>
              <div style={{ color: 'var(--muted)', margin: '3px 0 6px', fontSize: 11.5 }}>{dish.description_ar}</div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{dish.price} ل.س</div>
            </div>
            <button 
              style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => addToCart(restaurant.id, restaurant.name_ar, dish)}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <div className="bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '13px 26px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
            عرض السلة ({cartCount})
          </button>
        </div>
      )}
    </div>
  );
}

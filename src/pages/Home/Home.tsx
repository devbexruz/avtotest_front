import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = (): void => {
    if (isAuthenticated()) {
      navigate('/profile');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bilimingizni <span className="highlight">sinovdan o'tkazing</span> va natijangizni kuzating
          </h1>
          <p className="hero-subtitle">
            Zamonaviy test platformasi bilan o'z bilimingizni o'lchang va rivojlantiring
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              Boshlash
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate('/login')}>
              Kirish
            </button>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Mavzu bo'yicha testlar</h3>
            <p>O'zingizni qiziqtirgan mavzular bo'yicha test yeching</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✔</div>
            <h3>Imtihon topshirish</h3>
            <p>Haqiqiy imtihon sharoitida o'z bilimingizni sinang</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Batafsil statistika</h3>
            <p>O'z natijalaringizni kuzatib boring va rivojlaning</p>
          </div>
        </div>
      </div>

      <section className="contact-section">
        <h2>Bog'lanish</h2>
        <div className="telegram-contact">
          <span className="telegram-icon">📱</span>
          <a href="https://t.me/edutest_ai" className="telegram-link">
            Telegram: @edutest_ai
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
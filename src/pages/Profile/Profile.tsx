import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';
import './Profile.css';

interface MenuCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  path: string;
  color: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const menuCards: MenuCard[] = [
    {
      id: 1,
      icon: '🏢',
      title: 'Mavzu bo\'yicha testlar',
      description: 'Turli mavzular bo\'yicha testlar',
      path: '/tests/themes',
      color: '#3498db'
    },
    {
      id: 2,
      icon: '✔',
      title: 'Imtihon topshirish',
      description: '20 ta savol, 3 ta xato chegarasi',
      path: '/tests/exam',
      color: '#2ecc71'
    },
    {
      id: 3,
      icon: '⚙',
      title: 'Sozlamali testlar',
      description: 'O\'zingiz sozlang: 40, 60, 120 ta savol',
      path: '/tests/custom',
      color: '#9b59b6'
    },
    {
      id: 4,
      icon: '⛽',
      title: 'Biletlar bo\'yicha testlar',
      description: 'Har biletda 10 ta savol',
      path: '/tests/tickets',
      color: '#e74c3c'
    },
    {
      id: 5,
      icon: '📊',
      title: 'Statistika',
      description: 'Natijalaringizni kuzatish',
      path: '/statistics',
      color: '#f39c12'
    }
  ];

  const handleCardClick = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <h1 className="user-name">{user?.full_name || 'Foydalanuvchi'}</h1>
            <p className="user-role">{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</p>
          </div>
        </div>
      </div>

      <div className="menu-grid">
        {menuCards.map((card) => (
          <div
            key={card.id}
            className="menu-card"
            onClick={() => handleCardClick(card.path)}
            style={{ '--card-color': card.color } as React.CSSProperties}
          >
            <div className="card-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
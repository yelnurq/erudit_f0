import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.css'; // Import the styles
import axiosInstance from '../../axiosConfig';

export default function AdminHeader({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // For loading state
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // For sidebar visibility

  const token = localStorage.getItem('token_admin'); // Get token from localStorage

  const handleLogout = async () => {
    if (!token) {
      alert('Ошибка: не найден токен. Пожалуйста, войдите заново.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/admin/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem('token_admin');
        navigate('/auth/admin');
      } else {
        alert('Не удалось выйти. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Ошибка при выходе. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  return (
    <div className={styles.adminPanel}>
      <div className={`${styles.sidebar} ${isSidebarVisible ? styles.showSidebar : ''}`}>
        <div className={styles.logo}>
          <Link to={'/admin'}>
            Панель администратора
          </Link>
        </div>
        <Link to="/admin/" className={styles.sidebarBtn}>База вопросов</Link>
        <Link to="/admin/users" className={styles.sidebarBtn}>Пользователи</Link>
        <Link to="/admin/ratings" className={styles.sidebarBtn}>Топ участников</Link>

        <div className={styles.user}>
          <Link to="/" className={styles.userLink}>Войти как пользователь</Link>
        </div>

        {/* Logout Button */}
        {token ? (
          <div className={styles.logBtn}>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Выход...' : 'Выйти'}
            </button>
          </div>
        ) : (
          <div className={styles.loginReminder}>
            <Link to="/auth/admin">Войдите снова</Link>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <button 
        className={styles.toggleSidebarBtn} 
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

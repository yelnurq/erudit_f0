import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import styles from './AdminPanel.module.css'; 
import axiosInstance from '../../axiosConfig';

export default function AdminPanel() {
  const [scorersCount, setScorersCount] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // Получаем общее количество участников
  const fetchScorersCount = async () => {
    const token = localStorage.getItem("token_admin"); 
    if (!token) {
      setError("Токен не найден");
      return;
    }

    setLoading(true); 
    try {
      const response = await axiosInstance.get('/api/admin/scorers-count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScorersCount(response.data.total_scorers);
    } catch (error) {
      setError("Ошибка при получении данных");
      console.error("Ошибка:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchScorersCount();
  }, []);

  return (
      <AdminHeader>
              <div className={styles.content}>
                {loading && <p>Загрузка...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {!loading && !error && (
                  <div className={styles.scorersCount}>
                    <h2>Общее количество участников: {scorersCount}</h2>
                  </div>
                )}
      </div>
      </AdminHeader>
  );
}

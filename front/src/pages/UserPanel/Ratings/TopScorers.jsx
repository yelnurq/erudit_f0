import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TopScorers.module.css'; // Импортируем стили как модуль
import axiosInstance from '../../../axiosConfig';

export default function TopScorers({ subjectId }) {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopScorers = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get('/api/admin/top-scorers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
          },
          params: {
            subject_id: subjectId, // Используем выбранный предмет
          },
        });
        setTopScorers(response.data);
      } catch (error) {
        setError('Ошибка загрузки топ-скореров');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchTopScorers();
    } else {
      setTopScorers([]); // Если нет выбранного предмета, очищаем список
      setLoading(false);
    }
  }, [subjectId]);

  // Сортировка топ-скореров по общему баллу (total_score) по убыванию
  const sortedTopScorers = topScorers.sort((a, b) => b.total_score - a.total_score);

  return (
    <div className={styles.topScorersContainer}>
      <h2 className={styles.topScorersTitle}>Топ участников</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <p className={styles.loadingText}>Загрузка...</p>
      ) : (
        sortedTopScorers.length > 0 ? (
          <table className={styles.topScorersTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Имя пользователя</th>
                <th>Почта</th>
                <th>Телефон</th>
                <th>Общий балл</th>
                <th>Средний балл</th>
                <th>Количество участий</th>
              </tr>
            </thead>
            <tbody>
              {sortedTopScorers.map((score, index) => (
                <tr key={score.user.id}>
                  <td>{index + 1}</td>
                  <td>{score.user.username || 'Не указано'}</td>
                  <td>{score.user.email || 'Не указано'}</td>
                  <td>{score.user.phone || 'Не указано'}</td>
                  <td>{score.total_score}</td> {/* Показываем общий балл */}
                  <td>{score.participation_count > 0 ? (score.total_score / score.participation_count).toFixed(2) : 'Не указано'}</td>
                  <td>{score.participation_count}</td> {/* Показываем количество участий */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noTopScorers}>Нет топ-участников для отображения.</p>
        )
      )}
    </div>
  );
}

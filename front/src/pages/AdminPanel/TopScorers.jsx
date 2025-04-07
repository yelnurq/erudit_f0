import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../axiosConfig';

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
            subject_id: subjectId, 
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
      setTopScorers([]); 
      setLoading(false);
    }
  }, [subjectId]);

  const sortedTopScorers = topScorers.sort((a, b) => b.total_score - a.total_score);

  return (
    <div className="top-scorers-container">
      <h2 className="top-scorers-title">Топ участников</h2>

      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

      {loading ? (
        <p className="loading-text">Загрузка...</p>
      ) : (
        sortedTopScorers.length > 0 ? (
          <table className="top-scorers-table">
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
                  <td>{score.total_score}</td>
                  <td>{score.participation_count > 0 ? (score.total_score / score.participation_count).toFixed(2) : 'Не указано'}</td>
                  <td>{score.participation_count}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-top-scorers">Нет топ-участников для отображения.</p>
        )
      )}
    </div>
  );
}

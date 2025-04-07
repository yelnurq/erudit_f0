import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Leader.module.css';  // Подключаем стиль
import Header from '../../../components/Header';
import axiosInstance from '../../../axiosConfig';

const Leader = () => {
  const [overallTopScorers, setOverallTopScorers] = useState([]);
  const [overallTopScorersLoading, setOverallTopScorersLoading] = useState(false);
  const [overallTopScorersError, setOverallTopScorersError] = useState(null);

  const fetchOverallTopScorers = async () => {
    setOverallTopScorersLoading(true);
    try {
      const response = await axiosInstance.get('/api/top-scorers-overall');
      const sortedData = response.data.sort((a, b) => b.total_score - a.total_score);
      setOverallTopScorers(sortedData);
    } catch (error) {
      setOverallTopScorersError('Ошибка загрузки общего рейтинга');
    } finally {
      setOverallTopScorersLoading(false);
    }
  };

  useEffect(() => {
    fetchOverallTopScorers();
  }, []);

  return (
    <Header footer>
    <div className={styles.leaderContainer}>
      <h3 className={styles.ratingsTitle}>Общий рейтинг</h3>
      <p className={styles.ratingsDesc}>Чтобы попасть в число лучших, необходимо набрать не менее 100 баллов.</p>
      {overallTopScorersError && <div className={styles.errorMessage}>{overallTopScorersError}</div>}
      {overallTopScorersLoading ? (
        <p className={styles.loadingText}>Загрузка...</p>
      ) : (
        overallTopScorers.length > 0 ? (
          <div className={styles.topScorersWrapper}>
          <table className={styles.topScorersTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Имя пользователя</th>
                <th>Общий балл</th>
              </tr>
            </thead>
            <tbody>
              {overallTopScorers.map((score, index) => (
                <tr key={score.user.id}>
                  <td>{index + 1}</td>
                  <td>{score.user.username || 'Не указано'}</td>
                  <td>{score.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className={styles.noTopScorers}>Нет топ-участников для отображения.</p>
        )
      )}
    </div>
    </Header>
  );
};

export default Leader;

  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import styles from './UserScores.module.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

  export default function UserScores({ username }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [uniqueCombinations, setUniqueCombinations] = useState(0);
    const [totalTests, setTotalTests] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [averageScore, setAverageScore] = useState(0);

    useEffect(() => {
      const fetchScores = async () => {
        try {
          const response = await axiosInstance.get('/api/userscores', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          setScores(response.data);
          const totalPoints = response.data.reduce((acc, score) => acc + (score.score || 0), 0);
          const average = totalPoints / response.data.length;

          setTotalScore(totalPoints);
          setAverageScore(average);
          setTotalTests(response.data.length);

          const uniqueScores = new Set(
            response.data.map(score => `${score.class || 'Не указано'}-${score.subject || 'Не указано'}`)
          );
          setUniqueCombinations(uniqueScores.size);

        } catch (error) {
          setError('Ошибка загрузки оценок');
        } finally {
          setLoading(false);
        }
      };

      fetchScores();
    }, []);

    const LastScore = ({ scores }) => {
      const lastScore = scores[scores.length - 1];
      if (!lastScore) {
        return (

          <div className={styles.lastScore}>
            <p>Нет оценок.</p>

          </div>
        )

      }
      return (
        <div className={styles.lastScore}>
          <p className={styles.lastScoreTitle}>Последняя оценка:</p>
          <p>Балл: <span className={styles.commonSpan}>{lastScore.score || '0'} из 5</span></p>
          <p>Предмет: <span className={styles.commonSpan}>{lastScore.subject || 'Не указано'}</span></p>
          <p>Номер документа: <span className={styles.commonSpan}>#{lastScore.documentNumber || 'Не указано'}</span></p>
          <p>Дата: <span className={styles.commonSpan}>{lastScore.date || 'Не указано'}</span></p>
        </div>
      );
    };

    return (
      <div className={styles.userscores}>
        <p className={styles.title}>Привет, {username}!</p>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        {loading ? (
          <div className={styles.skeletonContainer}> 
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
              <div className={styles.skeletons}></div>
        </div>
        ) : (
          <>
            <div className={styles.activity}>
              <p>Рейтинг (сумма всех баллов): <span className={styles.commonSpan}>{totalScore}</span>🏆</p>
            </div>
            <div className={styles.activity}>
              <p>Средний балл: <span className={styles.commonSpan}>
                  {(isNaN(averageScore) || averageScore === null) ? ' 0' : averageScore.toFixed(2)} из 5
                </span>
              </p>
            </div>

            <LastScore scores={scores} />

            <div className={styles.activity}>
              <p>Количество уникальных сочетаний (класс + предмет): <span className={styles.commonSpan}>{uniqueCombinations}</span></p>
            </div>

            <div className={styles.activity}>
              <p>Общее количество пройденных тестов: <span className={styles.commonSpan}>{totalTests}</span></p>
            </div>

            <div className={styles.userBlock}>
              <div className={styles.lastFive}>
                <Link to={'/userscores'}>Обзор последних результатов:</Link>
              </div>
              {scores.length > 0 ? (
                <div className={styles.userTableWrapper}>
                                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Балл</th>
                      <th>Класс</th>
                      <th>Код</th>
                      <th>Предмет</th>
                      <th style={{ width: 40 }}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.slice(-5).reverse().map((score, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{score.score || '0'} из 5</td>
                        <td>{score.class || 'Не указано'}</td>
                        <td>#{score.documentNumber || 'Не указано'}</td>
                        <td>{score.subject || 'Не указано'}</td>
                        <td>{score.date || 'Не указано'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : (
                <p>Нет оценок для отображения.</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

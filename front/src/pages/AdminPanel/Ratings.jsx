import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styles from './Ratings.module.css';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import axiosInstance from '../../axiosConfig';

export default function Ratings() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topScorers, setTopScorers] = useState([]);
  const [topScorersLoading, setTopScorersLoading] = useState(false);
  const [topScorersError, setTopScorersError] = useState(null);
  const [cachedTopScorers, setCachedTopScorers] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10); 

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/subjects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        setError('Ошибка загрузки предметов');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []); 

  const fetchTopScorers = async (subjectId) => {
    if (cachedTopScorers[subjectId] && cachedTopScorers[subjectId][currentPage]) {
      setTopScorers(cachedTopScorers[subjectId][currentPage]);
      return;
    }

    setTopScorersLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/top-scorers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
        },
        params: {
          subject_id: subjectId,
          page: currentPage,
          per_page: perPage,
        },
      });

      const sortedData = response.data.data.sort((a, b) => b.total_score - a.total_score);
      setTopScorers(sortedData);
      setTotalPages(response.data.last_page);
      setCachedTopScorers((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [currentPage]: sortedData, 
        },
      }));
    } catch (error) {
      setTopScorersError('Ошибка загрузки топ-скореров');
    } finally {
      setTopScorersLoading(false);
    }
  };

  const sortedTopScorers = useMemo(() => {
    return topScorers.sort((a, b) => b.total_score - a.total_score);
  }, [topScorers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchTopScorers(selectedSubject);
    }
  };

  const handleSubjectSelection = (subjectId) => {
    if (selectedSubject === subjectId) return; 
    setSelectedSubject(subjectId);
    setCurrentPage(1); 
    fetchTopScorers(subjectId); 
  };

  return (
    <AdminHeader>
      <div className={styles.ratingsContainer}>
        <h2 className={styles.ratingsTitle}>Рейтинг по предметам</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading ? (
          <p className={styles.loadingText}>Загрузка...</p>
        ) : (
          <div className={styles.subjectList}>
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`${styles.subjectItem} ${selectedSubject === subject.id ? styles.selected : ''}`}
                onClick={() => handleSubjectSelection(subject.id)}
              >
                {subject.name}
              </div>
            ))}
          </div>
        )}

        {selectedSubject && (
          <div className={styles.topScorersContainer}>
            <h2 className={styles.topScorersTitle}>Топ участников</h2>
            {topScorersError && <div className={styles.errorMessage}>{topScorersError}</div>}
            {topScorersLoading ? (
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
                      <tr key={score.user_id}>
                        <td>{(currentPage - 1) * perPage + (index + 1)}</td>
                        <td>{score.user.username || 'Не указано'}</td>
                        <td>{score.user.email || 'Не указано'}</td>
                        <td>{score.user.phone || 'Не указано'}</td>
                        <td>{score.total_score != null && !isNaN(score.total_score) ? score.total_score : 'Не указано'}</td>
                        <td>{score.participation_count > 0 ? (score.total_score / score.participation_count).toFixed(2) : 'Не указано'}</td>
                        <td>{score.participation_count != null && !isNaN(score.participation_count) ? score.participation_count : 'Не указано'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.noTopScorers}>Нет топ-участников для отображения.</p>
              )
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Предыдущая
                </button>
                <span>
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Следующая
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminHeader>
  );
}

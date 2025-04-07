import { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './AllScore.module.css';
import Header from '../../../components/Header';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

export default function AllScore({ username }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);  // Set loading state for data fetching
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);  // Set loading to true when starting to fetch data
      try {
        const response = await axiosInstance.get(`/api/userscores/all?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setScores(response.data.data); // Set all scores for the current page
        setPagination(response.data.pagination); // Set pagination data
      } catch (error) {
        setError('Ошибка загрузки оценок');
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchScores();
  }, [currentPage]); // Fetch new data when currentPage changes

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.last_page) {
      setCurrentPage(pageNumber); // Update page if within valid range
    }
  };

  const totalPages = pagination.last_page || 1; // Default to 1 page if `last_page` is undefined

  return (
    <Header>
      <div className={styles.userscores}>
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <Link to={'/profile'} className={styles.backLink}>Назад</Link>

          <p className={styles.title}>Все результаты</p>
        <div className={styles.userTableWrapper}>

          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Балл</th>
                <th>Класс</th>
                <th>Номер</th>
                <th>Предмет</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Show loading skeletons instead of real rows when data is loading
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td><Skeleton width={30} /></td>
                    <td><Skeleton width={50} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={100} /></td>
                    <td><Skeleton width={100} /></td>
                  </tr>
                ))
              ) : (
                scores.map((score, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * 10 + (index + 1)}</td>
                    <td>{score.score || '0'} из 5</td>
                    <td>{score.class || 'Не указано'}</td>
                    <td>#{score.documentNumber || 'Не указано'}</td>
                    <td>{score.subject || 'Не указано'}</td>
                    <td>{score.date || 'Не указано'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>


        </div>
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
                {currentPage} / {totalPages}
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
    </Header>
  );
}

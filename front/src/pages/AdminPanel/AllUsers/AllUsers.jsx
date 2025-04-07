import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminHeader from '../../../components/AdminHeader/AdminHeader';
import styles from './AllUsers.module.css';
import axiosInstance from '../../../axiosConfig';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token_admin")
        const response = await axiosInstance.get('/api/admin/allusers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError(error?.response?.data?.message || 'Ошибка загрузки пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userTableRows = useMemo(() => {
    return users.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1}</td>
        <td>{user.username || 'Не указано'}</td>
        <td>{user.lastname || 'Не указано'}</td>
        <td>{user.firstname || 'Не указано'}</td>
        <td>{user.thirdname || 'Не указано'}</td>
        <td>{user.email || 'Не указано'}</td>
        <td>{user.phone || 'Не указано'}</td>
        <td>{user.organization || 'Не указано'}</td>
      </tr>
    ));
  }, [users]);

  return (
    <AdminHeader>
      <div className={styles.allUsers}>
        <h2>Список пользователей</h2>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          users.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Имя пользователя</th>
                  <th>Фамилия</th>
                  <th>Имя</th>
                  <th>Отчество</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Организация</th>
                </tr>
              </thead>
              <tbody>
                {userTableRows}
              </tbody>
            </table>
          ) : (
            <p>Нет пользователей для отображения.</p>
          )
        )}
      </div>
    </AdminHeader>
  );
}

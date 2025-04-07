import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import axiosInstance from '../../axiosConfig';

export default function Students() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/scorers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
          },
        });
        setUsers(response.data);  
      } catch (error) {
        setError('Ошибка загрузки участников');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
          <AdminHeader />
    
    <div className="all-users">
      <h2>Список участников</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        Array.isArray(users) && users.length > 0 ? (
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
                <th>Дата регистрации</th>
                <th>Оценка</th>
                <th>Класс</th>
                <th>Предмет</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.user.username || 'Не указано'}</td>
                  <td>{user.user.lastname || 'Не указано'}</td>
                  <td>{user.user.firstname || 'Не указано'}</td>
                  <td>{user.user.thirdname || 'Не указано'}</td>
                  <td>{user.user.email || 'Не указано'}</td>
                  <td>{user.user.phone || 'Не указано'}</td>
                  <td>{user.user.organization || 'Не указано'}</td>
                  <td>{user.user.created_at ? new Date(user.user.created_at).toLocaleDateString() : 'Не указано'}</td>
                  <td>{user.score || 'Не указано'}</td>
                  <td>{user.class || 'Не указано'}</td>
                  <td>{user.subject || 'Не указано'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет участников для отображения.</p>
        )
      )}
    </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfile() {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    thirdname: '',
    email: '',
    phone: '',
    organization: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  // Токен из localStorage
          }
        });
        setUser(response.data);
      } catch (error) {
        setError('Ошибка при загрузке данных');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put('http://127.0.0.1:8000/api/user', user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccessMessage(response.data.message);
    } catch (error) {
      setError('Ошибка при обновлении профиля');
    }
  };

  return (
    <div>
      <h2>Редактировать профиль</h2>

      {error && <div>{error}</div>}
      {successMessage && <div>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          value={user.firstname}
          onChange={handleChange}
          placeholder="Имя"
        />
        <input
          type="text"
          name="lastname"
          value={user.lastname}
          onChange={handleChange}
          placeholder="Фамилия"
        />
        <input
          type="text"
          name="thirdname"
          value={user.thirdname || ''}
          onChange={handleChange}
          placeholder="Отчество"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          value={user.phone || ''}
          onChange={handleChange}
          placeholder="Телефон"
        />
        <input
          type="text"
          name="organization"
          value={user.organization || ''}
          onChange={handleChange}
          placeholder="Организация"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Новый пароль"
        />
        <input
          type="password"
          name="password_confirmation"
          value={user.password_confirmation}
          onChange={handleChange}
          placeholder="Подтверждение пароля"
        />
        <button type="submit">Обновить</button>
      </form>
    </div>
  );
}

export default EditProfile;

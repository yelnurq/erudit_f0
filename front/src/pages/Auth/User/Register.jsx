import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './Register.module.css';  
import Header from "../../../components/Header";
import axiosInstance from "../../../axiosConfig";

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
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
  const [isChecked, setIsChecked] = useState(false);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!isChecked) {
      setError("Вы должны согласиться с условиями обработки данных.");
      return;  
    }

    try {
      const response = await axiosInstance.post("/api/register", formData);
      setSuccessMessage("Вы успешно зарегистрированы!");

      setTimeout(() => {
        window.location.href = '/auth/login';  
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Произошла ошибка при регистрации.");
      } else {
        setError("Ошибка соединения с сервером.");
      }
    }
  };

  return (
      <Header>
      <div className={styles.registerForm}>
        <p className={styles.registerForm_title}>Регистрация</p>

        <form onSubmit={handleSubmit}>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="username"
      value={formData.username}
      onChange={handleChange}
      placeholder="Имя пользователя"
      required
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="firstname"
      value={formData.firstname}
      onChange={handleChange}
      placeholder="Имя"
      required
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="lastname"
      value={formData.lastname}
      onChange={handleChange}
      placeholder="Фамилия"
      required
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="thirdname"
      value={formData.thirdname}
      onChange={handleChange}
      placeholder="Отчество (опционально)"
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Электронная почта"
      required
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Телефон (опционально)"
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="text"
      name="organization"
      value={formData.organization}
      onChange={handleChange}
      placeholder="Организация (опционально)"
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Пароль"
      required
      autoComplete="new-password"  
    />
  </div>
  <div className={styles.inputGroup}>
    <input
      type="password"
      name="password_confirmation"
      value={formData.password_confirmation}
      onChange={handleChange}
      placeholder="Подтверждение пароля"
      required
      autoComplete="new-password"  
    />
  </div>

  <div className={styles.checkbox}>
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      Согласен с <Link to="/terms">условиями обработки данных</Link>
    </label>
  </div>
                                {successMessage && (
                                      <div className={styles.successMessage}>{successMessage}</div>
                                  )}
                                {error && (
                                  <div className={styles.errorMessage}>{error}</div>
                                )}
  <div>
    <button type="submit" className={styles.submitButton}>Зарегистрироваться</button>
  </div>

  <div className={styles.reg_nav}>
    <p className={styles.reg_nav_text}>Уже есть аккаунт? <Link to={'/auth/login'}>Войти</Link></p>
  </div>
</form>

      </div>
    
    </Header>
  );
}

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from './Login.module.css';  
import Header from "../../../components/Header";
import axiosInstance from "../../../axiosConfig";


export default function AdminLogin() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.post("/api/admin/login", data);

      if (response.status === 200 && response.data.token_admin) {
        const token = response.data.token_admin;
        localStorage.setItem("token_admin", token); 
        setSuccessMessage("Вход выполнен успешно!");  
        navigate('/admin'); 
      } else {
        setError("Неверные данные для входа.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Неверный логин или пароль.");
        } else {
          setError("Произошла ошибка при авторизации.");
        }
      } else {
        // Ошибка сети или другая
        setError("Ошибка соединения с сервером.");
      }
    }
  };

  return (
      <Header>
      <div className={styles.loginForm}>
        <p className={styles.loginForm_title}>Вход для админа</p>


        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Логин: "
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Пароль: "
              required
            />
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>Войти</button>
          </div>
        {error && <div className={styles.errorMessage}>{error}</div>}

{successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        </form>

        <div className={styles.back}>
          <Link className={styles.backNav} to={"/"}>› назад</Link>
        </div>
      </div>

    </Header>
  );
}

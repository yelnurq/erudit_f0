import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import Header from "../../../components/Header";
import axiosInstance from "../../../axiosConfig";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccessMessage(null);
    setLoading(true); 

    try {
      const response = await axiosInstance.post("/api/login", data);

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token); 
        setSuccessMessage("Вход выполнен успешно!"); 
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
        setError("Ошибка соединения с сервером.");
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (successMessage) {
      navigate('/profile');
    }
  }, [successMessage, navigate]);


  return (
      <Header>
      <div className={styles.loginForm}>
        <p className={styles.loginForm_title}>Вход в систему</p>


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
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Загружаем...' : 'Войти'}
            </button>
          </div>
                                {successMessage && (
                                      <div className={styles.successMessage}>{successMessage}</div>
                                  )}
                                {error && (
                                  <div className={styles.errorMessage}>{error}</div>
                                )}
          <div className={styles.back}>
            <Link className={styles.backNav} to={"/"}>› назад</Link>
          </div>
          <div className={styles.reg_nav}>
            <p className={styles.reg_nav_text}>Нет аккаунта? <Link to={'/auth/register'}>Регистрация</Link></p>
          </div>
          
        </form>
      </div>
      
    </Header>
  );
}

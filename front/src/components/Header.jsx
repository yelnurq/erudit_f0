import { Link, NavLink } from "react-router-dom";
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Footer from "./Footer/Footer";
import axiosInstance from "../axiosConfig";

export default function Header({ children, home, footer }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const burgerRef = useRef(null); // Реф для бургер-кнопки

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, [token]);

    const handleLogout = async () => {
        setLoading(true);
        if (!token) {
            alert('Ошибка: не найден токен. Пожалуйста, войдите заново.');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                setToken(null);
                navigate('/');
            } else {
                alert('Не удалось выйти. Попробуйте позже.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Ошибка при выходе. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // Закрытие меню при клике вне него или на бургер-кнопку
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) && // Проверяем, кликнули ли вне меню
                burgerRef.current && !burgerRef.current.contains(event.target) // Проверяем, не кликнули ли по бургеру
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <>
            <div className={styles.header}>
                {/* Бургер-меню */}
                <div ref={burgerRef} className={styles.burger} onClick={toggleMenu}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </div>
                <div className={styles.logo}>
                    <Link to={'/'}>
                        <img src="/images/erudit.svg" alt="erudit_logo" />
                    </Link>
                </div>
                {/* Навигация */}
                <div ref={menuRef} className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                    <NavLink to={'/quiz'} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Олимпиады</NavLink>
                    <NavLink to={'/ratings'} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Рейтинги</NavLink>
                    <NavLink to={'/check-document'} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Проверка документа</NavLink>
                    <NavLink to={'/leaders'} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Топ-100</NavLink>

                    {/* Logout button */}
                    {token ? (
                        <>
                            <NavLink to={'/profile'} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Личный кабинет</NavLink>
                            <div className={styles.authButtons}>
                                <button className={styles.logoutButton} onClick={handleLogout} disabled={loading}>
                                    {loading ? 'Выход...' : 'Выйти'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.authButtons}>
                            <NavLink to={'/auth/login'} className={({ isActive }) => isActive ? `${styles.loginButton} ${styles.active}` : styles.loginButton}>Войти</NavLink>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.wrapper}>
                <div className={home ? styles.home : styles.content}>
                    {children}
                </div>
                <div className={styles.iconImages}>
                    <img src={"/images/icon3.svg"} alt="tracery icon" className={styles.icon1} />
                    <img src={"/images/icon3.svg"} alt="tracery icon" className={styles.icon2} />
                </div>
                {footer && (
                    <footer>
                        <Footer />
                    </footer>
                )}
            </div>
        </>
    );
}

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../../../components/Header';
import styles from './Profile.module.css';
import UserScores from '../Score/UserScores';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axiosInstance from '../../../axiosConfig';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    thirdname: '',
    phone: '',
    organization: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  // Fetch user data on mount
  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/user', {
        headers: getAuthHeader(),
      });
      setUser(response.data);
      setFormData({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        thirdname: response.data.thirdname || '',
        phone: response.data.phone || '',
        organization: response.data.organization || '',
      });
    } catch (error) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle form changes (profile or password)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await axiosInstance.put('/api/user/update', formData, {
        headers: getAuthHeader(),
      });
      setSuccessMessage('Данные успешно обновлены!');
    } catch (error) {
      setError('Ошибка при обновлении данных');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    // Check if the passwords match before sending the request
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
  
    // Check password length locally before sending to backend
    if (passwordData.newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return;
    }
  
    try {
  
      const response = await axiosInstance.put(
        '/api/user/change-password',
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          newPassword_confirmation: passwordData.confirmPassword, // Correct parameter name
        },
        {
          headers: getAuthHeader(),
        }
      );
  
      // Show success message if the password was successfully changed
      setSuccessMessage('Пароль успешно изменён!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }); // Clear password fields after success
  
    } catch (error) {
      // Show error message from the backend if there's an issue
      const errorMessage =
        error.response?.data?.error || 'Ошибка при изменении пароля';
      setError(errorMessage);
    } finally {
      setLoading(false); // Set loading state to false after the request finishes
    }
  };
  



  return (
      <Header>
      <div className={styles.profileBlocksContainer}>
        <div className={styles.profileBlocks}>
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
              <div className={styles.skeletons}></div>
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
              <UserScores username={user ? user.username : ''} />
              <div className={styles.profileContainer}>
                {/* Tab navigation */}
                <div className={styles.tabs}>
                      <button
                        className={activeTab === 'personal' ? `${styles.activeTab}` : ''} // Apply activeTab styles if it's active
                        onClick={() => setActiveTab('personal')}
                      >
                        Персональные данные
                      </button>
                      <button
                        className={activeTab === 'security' ? `${styles.activeTab}` : ''} // Apply activeTab styles if it's active
                        onClick={() => setActiveTab('security')}
                      >
                        Безопасность
                      </button>
                    </div>


                {/* Tab Content */}
                {activeTab === 'personal' && (
                  <div className={styles.personalTabContent}>
                    <p className={styles.profileHeader}>Личные данные</p>
                    {user && (
                      <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
                        <div className={styles.inputGroup}>
                          <label>Имя:</label>
                          <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleFormChange}
                            placeholder="Имя"
                            required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Фамилия:</label>
                          <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleFormChange}
                            placeholder="Фамилия"
                            required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Отчество:</label>
                          <input
                            type="text"
                            name="thirdname"
                            value={formData.thirdname}
                            onChange={handleFormChange}
                            placeholder="Отчество"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Телефон:</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="Телефон"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Организация:</label>
                          <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleFormChange}
                            placeholder="Организация"
                          />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                          Обновить данные
                        </button>
                        {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}
                       {error && (
                        <div className={styles.errorMessage}>{error}</div>
                      )}
                      </form>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className={styles.securityTabContent}>
                    <p className={styles.changePasswordTitle}>Изменить пароль</p>
                    <form onSubmit={handleChangePassword}>
                      <div className={styles.inputGroup}>
                        <label>Старый пароль:</label>
                        <input
                          type="password"
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Старый пароль"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Новый пароль:</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Новый пароль"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Подтверждение пароля:</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Подтвердите новый пароль"
                          required
                        />
                      </div>
                      <button type="submit" className={styles.submitButton}>
                        Изменить пароль
                      </button>
                      {successMessage && (
                            <div className={styles.successMessage}>{successMessage}</div>
                        )}
                      {error && (
                        <div className={styles.errorMessage}>{error}</div>
                      )}
                    </form>

                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
      </Header>
  );
}

export default Profile;

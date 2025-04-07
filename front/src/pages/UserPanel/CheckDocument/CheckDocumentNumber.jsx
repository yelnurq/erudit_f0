import { useState } from 'react';
import axios from 'axios';
import Header from '../../../components/Header';
import styles from './CheckDocumentNumber.module.css'; // Подключаем модульный CSS
import axiosInstance from '../../../axiosConfig';

export default function CheckDocumentNumber() {
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentData, setDocumentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Функция для отправки запроса на проверку номера документа
  const checkDocument = async () => {
    if (!documentNumber) {
      setError('Номер документа обязателен');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/check-document-number', {
        params: { document_number: documentNumber },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.exists) {
        setDocumentData(response.data); // Сохраняем данные документа
      } else {
        setError('Документ не найден');
        setDocumentData(null); // Если документ не найден, очищаем данные
      }
    } catch (err) {
      setError('Ошибка при проверке документа');
      setDocumentData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Header footer>
      <div className={styles.container}>
        <p className={styles.title}>Проверка номера документа</p>
        <p className={styles.infoText}>
          Введите номер документа, чтобы проверить его существование в системе.
          Убедитесь, что вы ввели номер без ошибок.
        </p>

        <input
          type="text"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          placeholder="Введите номер документа"
          className={styles.inputField}
        />
        <button onClick={checkDocument} disabled={loading} className={styles.button}>
          {loading ? 'Проверка...' : 'Проверить'}
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {documentData && (
        <div className={styles.documentInfoContainer}>
          <h3 className={styles.documentTitle}>Информация о документе:</h3>
          <p>Номер документа: <span className={styles.commonSpan}>#{documentData.document_number}</span></p>
          <p>Балл: <span className={styles.commonSpan}>{documentData.score || 'Не указано'} из 5</span></p>
          <p>Класс: <span className={styles.commonSpan}>{documentData.class || 'Не указано'}</span></p>
          <p>Предмет: <span className={styles.commonSpan}>{documentData.subject || 'Не указано'}</span></p>
          <p>Дата: <span className={styles.commonSpan}>{documentData.date || 'Не указано'}</span></p>
          <h3 className={styles.documentTitle}>Данные пользователя:</h3>
          <p>Имя: <span className={styles.commonSpan}>{documentData.user.firstname}</span></p>
          <p>Фамилия: <span className={styles.commonSpan}>{documentData.user.lastname}</span></p>
          {
            documentData.user.thirdname && (
              <p>Отчество: <span className={styles.commonSpan}>{documentData.user.thirdname}</span> </p>
            )
          }
          <div className={styles.backLogo}>
            <p className={styles.backLogoText}>EruditGroup</p>
          </div>
        </div>
      )}

      </div>
    </Header>
  );
}

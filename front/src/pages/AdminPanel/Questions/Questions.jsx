import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Questions.module.css'; 
import AdminHeader from '../../../components/AdminHeader/AdminHeader';
import axiosInstance from '../../../axiosConfig';

export default function Questions() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    correct_answer: '',
    wrong_answer_1: '',
    wrong_answer_2: '',
    wrong_answer_3: '',
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(20);

  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      try {
        const token = localStorage.getItem('token_admin');
        const classResponse = await axiosInstance.get('/api/admin/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const subjectResponse = await axiosInstance.get('/api/admin/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(classResponse.data);
        setSubjects(subjectResponse.data);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      }
    };

    fetchClassesAndSubjects();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (classId && subjectId) {
        setLoading(true);
        try {
          const response = await axiosInstance.get('/api/admin/quiz', {
            params: {
              class_id: classId,
              subject_id: subjectId,
              page: currentPage,
              per_page: perPage,
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
          });
          setQuestions(response.data.questions);
          setTotalPages(response.data.last_page);
        } catch (err) {
          setError('Ошибка при загрузке вопросов');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [classId, subjectId, currentPage, perPage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      setIsFilterApplied(true);
    } catch (err) {
      setError('Ошибка при загрузке вопросов');
      setIsFilterApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` },
      });
      setQuestions(questions.filter((question) => question.id !== id));
      alert(response.data.message);
    } catch (err) {
      alert('Ошибка при удалении вопроса');
    }
  };

  const handleUpdate = async () => {
    if (!editingQuestion) return;

    const { id, question, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3 } = editingQuestion;

    try {
      const response = await axiosInstance.put(
        `/api/admin/questions/${id}`,
        { 
          question, 
          correct_answer: correct_answer || '',
          wrong_answer_1: wrong_answer_1 || '',
          wrong_answer_2: wrong_answer_2 || '',
          wrong_answer_3: wrong_answer_3 || ''
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` } }
      );

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === id ? { ...q, question, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3 } : q
        )
      );

      alert(response.data.message);
      setEditingQuestion(null);
    } catch (err) {
      console.error('Ошибка при обновлении вопроса:', err.response?.data || err.message);
      alert('Ошибка при обновлении вопроса');
    }
  };

  const handleAddQuestion = async (event) => {
    event.preventDefault();

    const { question, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3 } = newQuestion;

    try {
      const response = await axiosInstance.post(
        '/api/admin/questions',
        { question, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, class_id: classId, subject_id: subjectId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token_admin')}` } }
      );
      setQuestions((prevQuestions) => [response.data.data, ...prevQuestions]);
      alert(response.data.message);

      setIsAddQuestionOpen(false);
      setNewQuestion({ question: '', correct_answer: '', wrong_answer_1: '', wrong_answer_2: '', wrong_answer_3: '' });
    } catch (err) {
      alert('Ошибка при добавлении вопроса');
    }
  };

  const openModal = (question) => {
    setSelectedQuestion(question);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminHeader>
      <div className={styles.questionsContainer}>
        <p>Фильтр вопросов</p>
        <div className={styles.tools}>
          <div className={styles.filterTools}>
          <form className={styles.filterForm} onSubmit={handleSubmit}>
  <div className={styles.selectContainer}>
    <select id="classId" value={classId} onChange={(e) => setClassId(e.target.value)}>
      <option value="">Выберите класс</option>
      {classes.map((classItem) => (
        <option key={classItem.id} value={classItem.id}>
          Класс {classItem.name}
        </option>
      ))}
    </select>
  </div>

  <div className={styles.selectContainer}>
    <select id="subjectId" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
      <option value="">Выберите предмет</option>
      {subjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
          {subject.name}
        </option>
      ))}
    </select>
  </div>

  <button 
    type="submit" 
    disabled={loading || !classId || !subjectId} 
    className={styles.filterBtn}
  >
    Применить фильтр
  </button>
</form>

          </div>
          <div className={styles.addTool}>
            <button onClick={() => setIsAddQuestionOpen(true)} disabled={!isFilterApplied} className={styles.addBtn}>
              Добавить вопрос
            </button>
          </div>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {isFilterApplied ? (
          <table className={styles.questionsTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>Вопрос</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <tr key={question.id}>
                    <td>{index + 1}</td>
                    <td>
                      <button onClick={() => openModal(question)}>{question.question}</button>
                    </td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(question.id)}>
                        Удалить
                      </button>
                      <button className={styles.editBtn} onClick={() => setEditingQuestion(question)}>
                        Редактировать
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Нет вопросов</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>Примените фильтр для отображения вопросов</p>
        )}
        {loading && <p className={styles.loadingMessage}>Загрузка вопросов...</p>}

        {isFilterApplied && totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Предыдущая
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <select onChange={(e) => handlePageChange(Number(e.target.value))} value={currentPage}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </select>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Следующая
            </button>
          </div>
        )}

        {isAddQuestionOpen && (
          <div className={styles.addQuestionModal}>
            <div className={styles.addQuestionContent}>
              <h3>Добавить вопрос</h3>
              <form onSubmit={handleAddQuestion} className={styles.addQuestionForm}>
                <input
                  type="text"
                  placeholder="Текст вопроса"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  placeholder="Правильный ответ"
                  value={newQuestion.correct_answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  placeholder="Неверный ответ 1"
                  value={newQuestion.wrong_answer_1}
                  onChange={(e) => setNewQuestion({ ...newQuestion, wrong_answer_1: e.target.value })}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  placeholder="Неверный ответ 2"
                  value={newQuestion.wrong_answer_2}
                  onChange={(e) => setNewQuestion({ ...newQuestion, wrong_answer_2: e.target.value })}
                  className={styles.inputField}
                />
                <input
                  type="text"
                  placeholder="Неверный ответ 3"
                  value={newQuestion.wrong_answer_3}
                  onChange={(e) => setNewQuestion({ ...newQuestion, wrong_answer_3: e.target.value })}
                  className={styles.inputField}
                />
                <div className={styles.buttonsContainer}>
                  <button type="submit" className={styles.saveBtn}>Сохранить</button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsAddQuestionOpen(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedQuestion && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>{selectedQuestion.question}</h3>
              <p style={{ color: 'green' }}>
                <span className={styles.checkIcon}>✔️</span> {selectedQuestion.correct_answer}
              </p>
              <ul>
                <li>❌{selectedQuestion.wrong_answer_1}</li>
                <li>❌{selectedQuestion.wrong_answer_2}</li>
                <li>❌{selectedQuestion.wrong_answer_3}</li>
              </ul>
              <button onClick={closeModal}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </AdminHeader>
  );
}

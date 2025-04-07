import React, { useState, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import styles from './Quiz.module.css';
import Header from '../../components/Header';
import axiosInstance from '../../axiosConfig';


ChartJS.register(ArcElement, Tooltip, Legend);

const Notification = ({ message, type }) => {
  if (!message) return null;
  return <div className={`${styles.notification} ${styles[type]}`}>{message}</div>;
};

export default function Quiz() {
  const [data, setData] = useState({
    classes: [],
    subjects: [],
    questions: [],
    answers: {},
  });
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOlympiadStarted, setIsOlympiadStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [documentNumber, setDocumentNumber] = useState('')
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false); 
  const [loadingResults, setLoadingResults] = useState(false); 

  const [diplomaBase64, setDiplomaBase64] = useState(''); 


  const fetchClassesAndSubjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/api/class-subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(prevState => ({
        ...prevState,
        classes: response.data.classes,
        subjects: response.data.subjects,
      }));
    } catch (err) {
      setError('Ошибка при загрузке данных');
    }
  }, []);

  useEffect(() => {
    fetchClassesAndSubjects();
  }, [fetchClassesAndSubjects]);

  const motivationMessage = () => {
    if (score >= data.questions.length * 0.8) {
      return "Отличная работа! Вы почти достигли максимума!";
    } else if (score >= data.questions.length * 0.5) {
      return "Хороший результат! Но есть где расти!";
    } else {
      return "Не расстраивайтесь, каждый шаг — это прогресс. Пробуйте снова!";
    }
  };

  const options = {
    responsive: true,  
    maintainAspectRatio: false,  
    plugins: {
      legend: {
        position: 'top',
      },
    },

  };
  

  const calculateChartData = () => {
    const correctPercentage = (score / data.questions.length) * 100;
    return {
      labels: ['Правильные ответы', 'Неправильные ответы'],
      datasets: [
        {
          label: 'Результаты',
          data: [correctPercentage, 100 - correctPercentage],
          backgroundColor: ['#2d9e49', '#9e2d2d'],
          borderWidth: 0,
        },
      ],

    };
  };

  const handleStartOlympiad = async () => {
    if (!classId || !subjectId) {
      setError('Пожалуйста, выберите класс и предмет');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/api/quiz/random', {
        params: { class_id: classId, subject_id: subjectId },
        headers: { Authorization: `Bearer ${token}` },
      });
      const questions = response.data.questions.slice(0, 10); 

      const shuffledQuestions = questions.map((question) => {
        const answers = [
          question.correct_answer,
          question.wrong_answer_1,
          question.wrong_answer_2,
          question.wrong_answer_3,
        ];
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return {
          ...question,
          shuffledAnswers: answers, 
        };
      });

      setData(prevState => ({
        ...prevState,
        questions: shuffledQuestions,
      }));
      setIsOlympiadStarted(true);
      setTimerActive(true); // Start timer
      setTimeLeft(600); // Reset to 10 minutes
      setStartTime(Date.now()); // Save start time
      setCurrentQuestionIndex(0); // Reset question index
      
    } catch (err) {
      setError('Ошибка при загрузке вопросов');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setData(prevState => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: selectedAnswer, 
      },
    }));
  };
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleFinish(); 
            return 0;
          }
          return prevTime - 1; 
        });
      }, 1000); 
    } else {
      clearInterval(interval); 
    }
  
    return () => clearInterval(interval); 
  }, [timerActive]);
  
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleDownload = async () => {
    if (!downloadUrl && !diplomaBase64) {  
      setError('Результаты еще не готовы для скачивания.');
      return;
    }
  
    if (diplomaBase64) {
      const link = document.createElement('a');
      link.href = diplomaBase64;
      link.download = 'Диплом_олимпиады.png'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (downloadUrl) {  
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Результаты_олимпиады.pdf'; // Название файла PDF
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleFinish = () => {
    setEndTime(Date.now()); // Save end time
    setTimerActive(false); // Stop timer
    setCurrentQuestionIndex(data.questions.length); // Finish quiz
    
    setQuizCompleted(true)
    handleSubmit(); // Automatically submit answers and calculate score
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(data.answers).map((questionId) => ({
      question_id: questionId,
      answer: data.answers[questionId],
    }));
  
    if (formattedAnswers.length < data.questions.length) {
      setError('Пожалуйста, ответьте на все вопросы перед отправкой.');
      return;
    }
    setLoadingResults(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/api/quiz/submit',
        {
          answers: formattedAnswers,
          class_id: classId,
          subject_id: subjectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDownloadUrl(response.data.diploma_url);
      setScore(response.data.score);
      setDocumentNumber(response.data.document_number);  // Сохраняем номер документа
      setDiplomaBase64(response.data.diploma_base64); // Сохраняем Base64 строку диплома
      setQuizCompleted(true); // Завершаем олимпиаду
    } catch (err) {
      setError('Ошибка при отправке результатов');
    } finally {
      setLoadingResults(false);
    }
  };
  

  
  const resetQuiz = () => {
    setIsOlympiadStarted(false);
    setTimerActive(false);
    setTimeLeft(600);
    setData({ ...data, answers: {} });
    setCurrentQuestionIndex(0);
    setError(null);
    setScore(0); // Reset score
    setQuizCompleted(false); // Сбрасываем статус завершения олимпиады
  };

  const getElapsedTime = () => {
    if (startTime && endTime) {
      const elapsed = (endTime - startTime) / 1000;
      const minutes = Math.floor(elapsed / 60);
      const seconds = Math.floor(elapsed % 60);
      return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    return '00:00';
  };

  const calculateAverageTime = () => {
    if (startTime && endTime && data.questions.length > 0) {
      const elapsed = (endTime - startTime) / 1000;
      return (elapsed / data.questions.length).toFixed(2); // Average time per question in seconds
    }
    return '0.00';
  };

  return (
    <Header>
      <div className={styles.block}>
        <div className={styles.quizContainer}>
          <Notification message={error} type="error" />
          {!isOlympiadStarted ? (
            <div className={styles.quizStartContainer}>
              <h3 className={styles.welcomeTitle}>Добро пожаловать на онлайн-олимпиаду!</h3>
              <p className={styles.welcomeDesc}>
                Дорогие участники!<br />
                Сегодня у вас есть уникальная возможность проверить свои знания, проявить интеллектуальные способности и доказать, что вы достойны победы!<br />
                Олимпиада — это не просто испытание, а шанс показать свои лучшие качества, получить ценный опыт и, конечно же, заслуженное признание.
                Не бойтесь сложных вопросов – каждый из них помогает вам расти и становиться сильнее. Пусть этот день принесет вам новые открытия, уверенность в себе и заслуженные награды!<br />
                Желаем вам удачи, сосредоточенности и высоких результатов! 🚀🏆
              </p>
              <div className={styles.selectTools}>
              <select className={styles.classSelect} value={classId} onChange={(e) => setClassId(e.target.value)}>
                <option value="">Выберите класс</option>
                {data.classes && data.classes.length > 0 ? (
                  data.classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      Класс {classItem.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Загрузка классов...</option>
                )}
              </select>

              <select
                  className={styles.subjectSelect}
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Выберите предмет</option>
                  {data.subjects && data.subjects.length > 0 ? (
                    data.subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Загрузка предметов...</option>
                  )}
                </select>

              </div>
              <button
                className={styles.startButton}
                onClick={handleStartOlympiad}
                disabled={!classId || !subjectId || loading}
              >
                Начать олимпиаду
              </button>
            </div>
          ) : (
            !quizCompleted && ( // Блок с вопросами скрывается после завершения олимпиады
              <div className={styles.quizOngoingContainer}>
                <div className={styles.timer}>
                  {endTime ? (
                    <></>
                  ) : (
                    <p>
                      Оставшееся время: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                    </p>
                  )}
                </div>
  
                {currentQuestionIndex < data.questions.length && (
                  <div className={styles.questionStatus}>
                    <p>Вопрос {currentQuestionIndex + 1} из {data.questions.length}</p>
                  </div>
                )}
  
                {data.questions.length > 0 && currentQuestionIndex < data.questions.length && (
                  <div key={data.questions[currentQuestionIndex].id} className={styles.questionContainer}>
                    <h3 className={styles.questionText}>{data.questions[currentQuestionIndex].question}</h3>
                    <div className={styles.answersContainer}>
                      {data.questions[currentQuestionIndex].shuffledAnswers.map((answer, idx) => (
                        <label key={idx} className={styles.answerOption}>
                          <input
                            type="radio"
                            name={`question_${data.questions[currentQuestionIndex].id}`}
                            value={answer}
                            checked={data.answers[data.questions[currentQuestionIndex].id] === answer}
                            onChange={() => handleAnswerChange(data.questions[currentQuestionIndex].id, answer)}
                          />
                          {answer}
                        </label>
                      ))}
                    </div>
  
                    {data.answers[data.questions[currentQuestionIndex].id] && (
                      <button
                        className={currentQuestionIndex === data.questions.length - 1 ? styles.finishButton : styles.nextButton}
                        onClick={currentQuestionIndex === data.questions.length - 1 ? handleFinish : handleNextQuestion}
                        disabled={loading} // Отключаем кнопку, если идет загрузка
                      >
                        {loading ? 'Загружаем...' : (currentQuestionIndex === data.questions.length - 1 ? 'Закончить' : 'Следующий вопрос')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          )}
{quizCompleted && (
  <div className={styles.resultContainer}>
    {loadingResults ? ( // Проверяем состояние загрузки
      <div className={styles.loadingContainer}>
        <p>Загрузка результатов...</p>
      </div>
    ) : (
      <>
        <p className={styles.resultTitle}>Результаты олимпиады</p>
        <p>Ваш результат: <span className={styles.resultSpan}>{score} из {data.questions.length}</span></p>
        <p>Среднее время на вопрос: <span className={styles.resultSpan}>{calculateAverageTime()} секунд</span></p>
        <p>Время, затраченное на олимпиаду: <span className={styles.resultSpan}>{getElapsedTime()}</span></p>
        <p className={styles.resultDocumentNumber}>Номер документа: <span className={styles.resultSpan}>#{documentNumber}</span></p>
        <p className={styles.resultMotivation}>{motivationMessage()}</p>



        <div className={styles.chartContainer}>
          <Pie style={{ width: '100%', height: '300px' }} data={calculateChartData()} options={options} />
        </div>

        <div className={styles.resultToolsBtn}>
          <button onClick={handleDownload} className={styles.downloadButton}>
            Скачать результаты
          </button>
          <button onClick={resetQuiz} className={styles.resetButton}>
            Пройти снова
          </button>
        </div>
      </>
    )}
  </div>
)}

        </div>
      </div>
    </Header>
  );
}

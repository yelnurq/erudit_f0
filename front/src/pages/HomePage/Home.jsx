import { useState } from 'react';
import Header from '../../components/Header';
import styles from './home.module.css';
import { Link } from "react-router-dom";

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const faqData = [
        { question: "Как зарегистрироваться?", answer: "Вы можете зарегистрироваться, заполнив заявку на сайте." },
        { question: "Как оплатить участие?", answer: "Оплата возможна через Kaspi QR или другие доступные способы." },
        { question: "Когда будут результаты?", answer: "Результаты будут сразу после того как закончили олимпиаду, их вы можете скачать сразу в блоке результатов." },
        { question: "Что такое рейтинг и как его набирать?", answer: "Рейтинг — это сумма получаемых баллов. За одну олимпиаду вы максимум можете набрать 40 баллов. Чем выше баллов, тем выше строка в рейтинге." },
        { question: "Зачем нужен рейтинг?", answer: "Рейтинг нужен для соревнований. Также будут проводиться конкурсы, основанные на рейтинге." }
    ];
    return (
        <Header home={true} footer={true}>
            <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.mainContainer}>
                <div className={styles.left_block}>
                    <p className={styles.title}>Твой интеллект -<br />твоя награда!</p>
                    <p className={styles.desc}>Пройди олимпиаду и получи диплом.</p>
                    <div className={styles.navBtn}>
                        <Link to={'/quiz'} className={styles.navLinkBtn}>Получить диплом</Link>
                    </div>
                </div>
                <div className={styles.right_block}>
                    <img src={"/images/group_image.png"} alt="group_erudit_image" />
                </div>
                </div>

            </div>               


            <div className={styles.quote}>
                    <div className={styles.quoteContainer}>
                        <p className={styles.quoteText}>
                            <span style={{fontSize:25}}>« </span>Красивым и сильным делают человека его ум, эрудиция, честь и обаяние. Больше ничто. И глуп тот, кто хочет возвыситься иным путем.
                            <span style={{fontSize:25}}> »</span>
                        </p>
                        <p className={styles.author}>Абай Кунанбаев</p>
                    </div>
                </div>


                {/* Этапы участия */}
                <div className={styles.stages}>
                    <div className={styles.stagesTitle}>Этапы участия в олимпиаде</div>
                    <div className={styles.timeline}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.timelineItem}>
                                <div className={styles.circle}>{i + 1}</div>
                                <div className={styles.line}></div>
                                <div className={`${styles.text} ${i % 2 === 0 ? styles.left : styles.right}`}>
                                    <strong>{["Регистрация", "Выберите класс и предмет", "Оплатите через Kaspi QR", "Ответьте на вопросы", "Получите свой диплом"][i]}</strong>
                                    <p>{[
                                        "Заполните заявку, указав свои данные, и зарегистрируйтесь на олимпиаду.",
                                        "Определите уровень сложности и предмет, в котором хотите соревноваться.",
                                        "Совершите оплату удобным способом через Kaspi QR для подтверждения участия.",
                                        "Пройдите тестирование, ответив на вопросы в установленное время.",
                                        "После успешного завершения получите электронный диплом победителя."
                                    ][i]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <img className={styles.stageIcon1} src={"images/icon3.svg"} alt="" />
                    <img className={styles.stageIcon2} src={"images/icon3.svg"} alt="" />
                </div>

                {/* FAQ Section */}
                <div className={styles.faq}>
                    <div className={styles.faqTitle}>Часто задаваемые вопросы</div>
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className={styles.faqQuestion}>
                                {item.question}
                                <span>{activeIndex === index ? "−" : "+"}</span>
                            </div>
                            <div className={styles.faqAnswer}>{item.answer}</div>
                        </div>
                    ))}
                </div>


            </div>
        </Header>
    );
}

import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <>
            <div className={styles.footerContainer}>
                
                {/* Блок: О центре */}
                <div className={styles.about}>
                    <p className={styles.sectionTitle}>Почему выбирают нас?</p>
                    <p className={styles.sectionDesc}>Образовательно-научный центр <strong> "ERUDIT GROUP" </strong> – это современное учебное заведение, предлагающее языковые и предметные курсы, а также подготовку к экзаменам.</p>
                    <p className={styles.sectionItem}>- Подготовка к НИШ, КТЛ, ЕНТ</p>
                    <p className={styles.sectionItem}>- IELTS, TOEFL</p>
                    <p className={styles.sectionItem}>- Онлайн олимпиады, диплом которых котируется везде</p>
                </div>
                
                {/* Блок: Соцсети */}
                <div className={styles.social}>
                    <p className={styles.sectionTitle}>Свяжитесь с нами</p>
                    {/* <p className={styles.sectionItem}><a className={styles.sectionNav} href="https://www.facebook.com/eruditgroup"><img src={"images/insta.svg"}/> Facebook</a></p> */}
                    <p className={styles.sectionItem}><a className={styles.sectionNav} href="https://www.instagram.com/eruditgroup/"><img src={"images/insta.svg"}/>Instagram</a></p>
                    <p className={styles.sectionItem}><a className={styles.sectionNav} href="https://www.facebook.com/eruditgroup/"><img src={"images/facebook.svg"}/>Facebook</a></p>
                </div>
                
                {/* Блок: Контакты */}
                <div className={styles.contact}>
                    <p className={styles.sectionTitle}>Контактная информация</p>

                    <p className={styles.sectionItem}>📍 Глинки 24, Семей, Казахстан</p>
                    <p className={styles.sectionItem}>📍 Жанасемейская 33, Семей, Казахстан</p>
                    <p className={styles.sectionItem}>📍 Уалиханова 1, Семей, Казахстан</p>

                    <p className={styles.sectionItem}>📧 eruditgroup@gmail.com</p>
                </div>
                {/* <div className={styles.icons}> */}
                    {/* <img className={styles.icon1} src={"images/icon1.svg"} alt="" /> */}
                    {/* <img className={styles.icon2} src={"images/icon2.svg"} alt="" /> */}
                {/* </div> */}
            </div>

            </>
    );
}

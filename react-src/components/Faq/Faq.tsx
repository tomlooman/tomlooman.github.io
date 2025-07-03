import React from "react";
import FaqItem from "./components/FaqItem/FaqItem";
import { FAQs } from "./constants/Faqs";
import style from "./Faq.module.scss";

const Faq = () => {
    console.log(FAQs);
    return (
        <div className={style.faqWrapper}>
            <h2>FAQ</h2>
            <div>
                {FAQs.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}

export default Faq;
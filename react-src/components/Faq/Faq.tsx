import React from "react";
import FaqItem from "./components/FaqItem/FaqItem";
import { FAQs } from "./constants/Faqs";
import style from "./Faq.module.scss";

interface FaqProps {
  courseId: number;
}

const Faq = ({ courseId }: FaqProps) => {
    console.log(FAQs);
    return (
        <div className={style.faqWrapper}>
            <h2>FAQ</h2>
            <div>
                {FAQs[courseId].map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}

export default Faq;
import React, { useState } from "react";
import upArrowSvg from "../../../../../public/assets/faq_arrow_up.svg";
import downArrowSvg from "../../../../../public/assets/faq_arrow_down.svg";
import rightArrowSvg from "../../../../../public/assets/faq_arrow_right.svg";
import style from "./FaqItem.module.scss";

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.wrapper}>
            <div className={style.question} onClick={() => setIsOpen(!isOpen)}>
                <div className={style.arrowWrapper}>
                    <img
                        src={rightArrowSvg}
                        alt="arrow right"
                        className={`${style.arrow} ${isOpen ? style.hidden : style.visible}`}
                    />
                    <img
                        src={downArrowSvg}
                        alt="arrow down"
                        className={`${style.arrow} ${style.arrowDown} ${isOpen ? style.visible : style.hidden}`}
                    />
                </div>
                <p>{question}</p>
            </div>

            {isOpen && <p className={style.answer}>{answer}</p>}
        </div>
    );
};

export default FaqItem;

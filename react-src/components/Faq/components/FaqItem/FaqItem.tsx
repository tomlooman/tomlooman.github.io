import React, { useState } from "react";
import upArrowSvg from "../../../../assets/faq_arrow_up.svg";
import downArrowSvg from "../../../../assets/faq_arrow_down.svg";
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
                <p>{question}</p>
                <div className={style.arrowWrapper}>
                    <img
                        src={upArrowSvg}
                        alt="arrow up"
                        className={`${style.arrow} ${isOpen ? style.hidden : style.visible}`}
                    />
                    <img
                        src={downArrowSvg}
                        alt="arrow down"
                        className={`${style.arrow} ${style.arrowDown} ${isOpen ? style.visible : style.hidden}`}
                    />
                </div>
            </div>

            {isOpen && <p className={style.answer}>{answer}</p>}
        </div>
    );
};

export default FaqItem;

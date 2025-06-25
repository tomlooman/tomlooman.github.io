import React from "react";
import rightArrowSvg from "../../assets/arrow_right.svg";
import style from "./LinkButton.module.scss";

interface LinkButtonProps {
    text: string;
    url: string;
}

const LinkButton = ({ text, url }: LinkButtonProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={style.linkButton}>
        <img src={rightArrowSvg} alt="right arrow icon" />
        <span>{text}</span>
    </a>
  );
};

export default LinkButton;

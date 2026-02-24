import React from "react";
import rightArrowSvg from "../../../public/assets/arrow_right.svg";
import style from "./LinkButton.module.scss";

interface LinkButtonProps {
    text: string;
    url: string;
    openInNewTab?: boolean;
}

const LinkButton = ({ text, url, openInNewTab }: LinkButtonProps) => {
  return (
    <a href={url} target={openInNewTab ? "_blank" : "_self"} rel="noopener noreferrer" className={style.linkButton}>
        <img src={rightArrowSvg} alt="right arrow icon" />
        <span>{text}</span>
    </a>
  );
};

export default LinkButton;

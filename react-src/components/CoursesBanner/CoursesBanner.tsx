import React from "react";
import style from "./CoursesBanner.module.scss";

const CoursesBanner = () => {
    return (
        <div className={style.container}>
            <div className={style.cPlusPlus}></div>
            <div className={style.optimisation}></div>
        </div>
    )

};

export default CoursesBanner;

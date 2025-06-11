import React from "react";
import style from "./CoursesMainIntroduction.module.scss";

const CoursesMainIntroduction = () => {
    return (
        <div className={style.container}>
            <div className={style.left} />
            <div className={style.middle} />
            <div className={style.right}>
                <div>Section 1</div>
                <div>Section 2</div>
                <div>Section 3</div>
            </div>
        </div>
    )
};

export default CoursesMainIntroduction;
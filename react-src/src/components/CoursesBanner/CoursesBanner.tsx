import React from "react";
import style from "./CoursesBanner.module.scss";


const CoursesBanner = () => {
  return (
    <div className={style.container}>
      <a
        href="/courses/unrealengine-cpp"
        className={style.cPlusPlus}
        aria-label="C++ course"
      />
      <a
        href="/courses/unrealengine-optimization"
        className={style.optimisation}
        aria-label="Optimization course"
      />
    </div>
  );
};

export default CoursesBanner;

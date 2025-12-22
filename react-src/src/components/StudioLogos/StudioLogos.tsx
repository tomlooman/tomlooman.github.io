import React from "react";
import { logos } from "./constants/Logos";
import styles from "./StudioLogos.module.scss";

interface StudioLogosProps {
  courseId: number;
}

const StudioLogos: React.FC<StudioLogosProps> = ({ courseId }) => {

  return (
    <div className={styles.studioLogos}>
      <h2>Companies using my Unreal Engine Courses</h2>
      <div className={styles.logos}>
         {logos[courseId]?.map((src: string, i: number) => (
        <img key={i} src={`/assets/images/studio_logos/${src}`} alt={`Studio logo ${i}`} className={styles.logo} />
      ))}
      </div>
    </div>
  );
};

export default StudioLogos;
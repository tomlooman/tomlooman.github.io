import React from "react";
import styles from "./StudioLogos.module.scss";

const logoFiles = [
  "Behaviour_interactive.png",
  "Epic_Games-Logo.wine.png",
  "MPG.png",
  "JetBrains_Logo_2016_250.png",
  "Black_Forest_Games_250.png",
  "lucid-logo.png",
  "Sparx_Logo_Red_PNG_FINAL.png",
  "Wargaming_Logo.png",
];

const StudioLogos = () => {

  return (
    <div className={styles.studioLogos}>
      <h2>My students work at game studios across the globe</h2>
      <div className={styles.logos}>
         {logoFiles.map((src, i) => (
        <img key={i} src={`/assets/images/studio_logos/${src}`} alt={`Studio logo ${i}`} className={styles.logo} />
      ))}
      </div>
    </div>
  );
};

export default StudioLogos;
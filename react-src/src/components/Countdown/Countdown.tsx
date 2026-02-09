import React, { useState, useEffect } from "react";
import style from "./Countdown.module.scss";

const getTargetDateUTC = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
};

interface CountdownProps {
  endDate: string;
}

const pad = (num: number) => num.toString().padStart(2, "0");

const Countdown: React.FC<CountdownProps> = ({ endDate }) => {
  const TARGET_DATE = getTargetDateUTC(endDate);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const diff = TARGET_DATE.getTime() - now;

    console.log("Current Time (UTC):", new Date(now).toISOString());

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className={style.countdownWrapper}>
      <span>
        {pad(days)}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </div>
  );
};

export default Countdown;

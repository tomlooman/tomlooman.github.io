import React from "react";
import { reviews } from "./constants/Reviews"
import style from "./Reviews.module.scss";
import ReviewItem from "./components/Review";

const Reviews = () => {
  return (
    <div className={style.reviewsWrapper}>
      <h2>What my students say</h2>
      <div className={style.reviews}>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;

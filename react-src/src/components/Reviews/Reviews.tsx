import React from "react";
import { reviews } from "./constants/Reviews"
import style from "./Reviews.module.scss";
import ReviewItem from "./components/Review";

interface ReviewsProps {
  courseId: number;
}

const Reviews = ({ courseId }: ReviewsProps) => {
  return (
    <div className={style.reviewsWrapper}>
      <div className={style.reviews}>
        {reviews[courseId].map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;

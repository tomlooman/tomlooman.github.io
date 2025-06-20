import React from "react";
import { Review } from "../../models/Review";
import style from "./ReviewItem.module.scss";

interface ReviewProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewProps) => {
  return (
    <div className={style.reviewItem}>
      <p dangerouslySetInnerHTML={{ __html: review.text }} />
      <div>
        <div className={style.line} />
        <h5>{review.name}</h5>
        <p>{review.jobTitle}{review.company && ` (${review.company})`}</p>
      </div>
    </div>
  );
};

export default ReviewItem;

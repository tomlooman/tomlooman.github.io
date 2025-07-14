import React from "react";
import style from "./LatestBlogs.module.scss";

interface LatestBlogsProps {
    posts: {
        title: string;
        url: string;
        coverImage: string;
    }[];
}

const LatestBlogs: React.FC<LatestBlogsProps> = ({ posts }) => {
    console.log(posts);
  return (
    <div className={style.container}>
        {posts.map((post) => (
            <a href={post.url} key={post.url}>
                <img src={`/assets/images/${post.coverImage}`} alt={post.title} />
            </a>
        ))}
    </div>
  );
};

export default LatestBlogs;

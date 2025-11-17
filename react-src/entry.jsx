import React from 'react';
import { createRoot } from 'react-dom/client';
import ListItem from './src/components/ListItem';
import CoursesBanner from './src/components/CoursesBanner';
import EmailSignUp from './src/components/EmailSignUp';
import CoursesMainIntroduction from './src/components/CoursesMainIntroduction';
import Reviews from './src/components/Reviews';
import Pricing from './src/components/Pricing';
import LinkButton from './src/components/LinkButton';
import LatestBlogs from './src/components/LatestBlogs';
import StudioLogos from './src/components/StudioLogos';
import FAQ from './src/components/FAQ';
import Footer from './src/components/Footer';

const listItems = document.getElementsByClassName('list-item');
if (listItems.length) {
  listItems.forEach(item => {
    const text = item.getAttribute('data-text');
    createRoot(item).render(<ListItem text={text} />);
  });
}

const coursesBanner = document.getElementById('courses-banner');
if (coursesBanner) {
  createRoot(coursesBanner).render(<CoursesBanner />);
}

const emailSighUp = document.getElementById('email-sign-up');
if (emailSighUp) {
  createRoot(emailSighUp).render(<EmailSignUp />);
}

const coursesMainIntroduction = document.getElementById('courses-main-introduction');
if (coursesMainIntroduction) {
  createRoot(coursesMainIntroduction).render(<CoursesMainIntroduction />);
}

const reviews = document.getElementById('reviews');
if (reviews) {
  const courseId = reviews.getAttribute('data-course-id');
  createRoot(reviews).render(<Reviews courseId={Number(courseId)} />);
}

const pricing = document.getElementById('pricing');
if (pricing) {
  const courseId = pricing.getAttribute('data-course-id');
  createRoot(pricing).render(<Pricing courseId={Number(courseId)} />);
}

const latestBlogs = document.getElementById('latest-blogs');
if (latestBlogs) {
  const posts = latestBlogs.getAttribute('data-posts');
  createRoot(latestBlogs).render(<LatestBlogs posts={JSON.parse(posts)} />);
}

const seeAllPostsButton = document.getElementById('see-all-posts-button');
if (seeAllPostsButton) {
  const text = seeAllPostsButton.getAttribute('data-text');
  const url = seeAllPostsButton.getAttribute('data-url');

  createRoot(seeAllPostsButton).render(<LinkButton text={text} url={url} />);
}

const studioLogos = document.getElementById('studio-logos');
if (studioLogos) {
  const courseId = reviews.getAttribute('data-course-id');
  createRoot(studioLogos).render(<StudioLogos courseId={Number(courseId)} />);
}

const faq = document.getElementById('faq');
if (faq) {
  const courseId = faq.getAttribute('data-course-id');
  createRoot(faq).render(<FAQ courseId={Number(courseId)} />);
}

const footer = document.getElementById('footer');
if (footer) {
  createRoot(footer).render(<Footer />);
}
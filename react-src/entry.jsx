import React from 'react';
import { createRoot } from 'react-dom/client';
import ListItem from './components/ListItem';
import CoursesBanner from './components/CoursesBanner';
import EmailSignUp from './components/EmailSignUp';
import CoursesMainIntroduction from './components/CoursesMainIntroduction';
import Reviews from './components/Reviews';
import LinkButton from './components/LinkButton';
import Footer from './components/Footer';

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
  createRoot(reviews).render(<Reviews />);
}

const seeAllPostsButton = document.getElementById('see-all-posts-button');
if (seeAllPostsButton) {
  const text = seeAllPostsButton.getAttribute('data-text');
  const url = seeAllPostsButton.getAttribute('data-url');

  createRoot(seeAllPostsButton).render(<LinkButton text={text} url={url} />);
}

const footer = document.getElementById('footer');
if (footer) {
  createRoot(footer).render(<Footer />);
}
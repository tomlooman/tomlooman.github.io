import React from 'react';
import { createRoot } from 'react-dom/client';
import ListItem from './components/ListItem';
import CoursesBanner from './components/CoursesBanner';
import EmailSignUp from './components/EmailSignUp';
import CoursesMainIntroduction from './components/CoursesMainIntroduction';

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
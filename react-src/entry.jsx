import React from 'react';
import { createRoot } from 'react-dom/client';
import ListItem from './components/ListItem';
import CoursesBanner from './components/CoursesBanner';

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

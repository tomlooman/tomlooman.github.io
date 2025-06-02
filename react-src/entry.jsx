import React from 'react';
import { createRoot } from 'react-dom/client';
import ListItem from './components/ListItem';

const listItem = document.getElementById('list-item');
if (listItem) {
  const text = listItem.getAttribute('data-text');

  createRoot(listItem).render(<ListItem text={text} />);
}

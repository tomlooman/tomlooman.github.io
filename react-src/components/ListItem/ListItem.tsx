import React from 'react';
import './ListItem.module.scss';

interface ListItemProps {
  text: string;
}

const ListItem = ({ text }: ListItemProps) => {
  return <li className="listItem">{text}</li>;
};

export default ListItem;
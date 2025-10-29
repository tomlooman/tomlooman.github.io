import React from 'react';
import style from './ListItem.module.scss';

interface ListItemProps {
  text: string;
}

const ListItem = ({ text }: ListItemProps) => {
  return <li className={style.listItem}>{text}</li>;
};

export default ListItem;
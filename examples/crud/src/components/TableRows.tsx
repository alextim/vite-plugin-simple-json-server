import { memo } from 'react';

import type { Item } from '../types';
import Row from './Row';

type Props = {
  items: Item[];
  onUpdate: (item: Item) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const TableRows = ({ items, onDelete, onUpdate }: Props) => {
  return (
    <>
      {items.map((item: Item) => (
        <Row key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </>
  );
};

export default memo(TableRows, (prev, next) => prev.items === next.items);

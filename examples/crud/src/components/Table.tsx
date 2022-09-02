import type { Item } from '../types';
import Row from './Row';

type Props = {
  items: Item[];
  onUpdate: (item: Item) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const Table = ({ items, onDelete, onUpdate }: Props) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th className="w-40">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <Row key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;

import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

const Table = ({ children }: Props) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th className="w-40">Actions</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default memo(Table);

import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

const Table = ({ children }: Props) => {
  return (
    <div className="tb tb-crud-example w-full grid grid-rows-[auto_1fr]">
      <div className="tb-head">
        <div>ID</div>
        <div>Name</div>
        <div>Actions</div>
      </div>
      <ul className="tb-body">{children}</ul>
    </div>
  );
};

export default memo(Table);

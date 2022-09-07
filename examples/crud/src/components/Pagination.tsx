const PaginationBtn = ({
  children,
  offset,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  offset: number;
  disabled: boolean;
  onClick: (offset: number) => void;
}) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onClick(offset);
  };
  return (
    <button className="btn btn-outline" disabled={disabled} onClick={clickHandler}>
      {children}
    </button>
  );
};

type Props = {
  offset: number;
  limit: number;
  totalCount: number;
  onClick: (offset: number) => void;
};

const Pagination = ({ offset, limit, totalCount, onClick }: Props) => {
  if (totalCount === 0) {
    return null;
  }
  const last = (Math.ceil(totalCount / limit) - 1) * limit;
  return (
    <div className="btn-group">
      <PaginationBtn offset={0} disabled={offset < limit} onClick={onClick}>
        First
      </PaginationBtn>
      <PaginationBtn offset={offset - limit} disabled={offset < limit} onClick={onClick}>
        Prev
      </PaginationBtn>
      <PaginationBtn offset={offset + limit} disabled={offset >= last} onClick={onClick}>
        Next
      </PaginationBtn>
      <PaginationBtn offset={last} disabled={offset >= last} onClick={onClick}>
        Last
      </PaginationBtn>
    </div>
  );
};

export default Pagination;

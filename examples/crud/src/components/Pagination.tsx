const PaginationBtn = ({
  children,
  offset,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  offset: number;
  disabled: boolean;
  onClick: (offset: number) => Promise<void>;
}) => {
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await onClick(offset);
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
  updateOffset: (offset: number) => Promise<void>;
};

const Pagination = ({ offset, limit, totalCount, updateOffset }: Props) => {
  if (totalCount === 0) {
    return null;
  }
  const last = (Math.ceil(totalCount / limit) - 1) * limit;
  return (
    <div className="btn-group">
      <PaginationBtn offset={0} disabled={offset < limit} onClick={updateOffset}>
        First
      </PaginationBtn>
      <PaginationBtn offset={offset - limit} disabled={offset < limit} onClick={updateOffset}>
        Prev
      </PaginationBtn>
      <PaginationBtn offset={offset + limit} disabled={offset >= last} onClick={updateOffset}>
        Next
      </PaginationBtn>
      <PaginationBtn offset={last} disabled={offset >= last} onClick={updateOffset}>
        Last
      </PaginationBtn>
    </div>
  );
};

export default Pagination;

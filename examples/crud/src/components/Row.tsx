import { useState, useRef, memo } from 'react';

import useClickOutside from '../hooks/useClickOutside';
import useNameInput from '../hooks/useNameInput';

import type { Item } from '../types';

import NameInput from './NameInput';

type Props = {
  item: Item;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (item: Item) => Promise<void>;
};

const Row = ({ item, onDelete, onUpdate }: Props) => {
  const [edit, setEdit] = useState(false);
  const { name, reset: resetName, onChange } = useNameInput(item.name);
  const wrapperRef = useRef<HTMLTableRowElement>(null);

  useClickOutside(wrapperRef, () => void reset());

  function reset() {
    setEdit(false);
    resetName();
  }

  const dblClickHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  const onDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    await onDelete(id);
  };

  const onEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };

  const onSaveClick = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    await onUpdate({ id, name });
    setEdit(false);
  };

  const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
  };

  return (
    <tr ref={wrapperRef}>
      <td>{item.id}</td>
      <td>{edit ? <NameInput value={name} onChange={onChange} /> : <div onDoubleClick={dblClickHandler}>{item.name}</div>}</td>
      <td className="grid grid-cols-[50%_50%] gap-2">
        {edit ? (
          <>
            <button
              type="button"
              className="btn btn-primary btn-outline"
              disabled={!name}
              onClick={async (e) => await onSaveClick(e, item.id)}
            >
              Save
            </button>
            <button type="button" className="btn btn-secondary btn-outline" onClick={onCancelClick}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={onEditClick}>
              Edit
            </button>
            <button type="button" className="btn btn-ghost" onClick={async (e) => await onDeleteClick(e, item.id)}>
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default memo(Row, (prev, next) => prev.item.id === next.item.id && prev.item.name === next.item.name);

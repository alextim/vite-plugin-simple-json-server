import { memo } from 'react';

import useNameInput from '../hooks/useNameInput';
import type { Item } from '../types';
import NameInput from './NameInput';

type Props = {
  onAdd: (item: Item) => Promise<boolean>;
};

const AddForm = ({ onAdd }: Props) => {
  const { name, reset, onChange } = useNameInput('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await onAdd({ id: -1, name })) {
      reset();
    }
  };

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <div className="form-control w-full max-w-xs">
        <label htmlFor="name" className="label">
          <span className="label-text">Name</span>
        </label>
        <NameInput value={name} onChange={onChange} />
      </div>
      <button className="btn btn-primary w-fit" disabled={!name} type="submit">
        Add new
      </button>
    </form>
  );
};

export default memo(AddForm);

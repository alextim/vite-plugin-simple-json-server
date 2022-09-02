import React from 'react';
import useNameInput from '../hooks/useNameInput';
import type { Item } from '../types';

type Props = {
  onAdd: (item: Item) => Promise<boolean>;
};

const AddForm = ({ onAdd }: Props) => {
  const { name, reset, onChange } = useNameInput('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await onAdd({ id: -1, name })) {
      reset();
    }
  };

  return (
    <form className="card card-body" onSubmit={onSubmit}>
      <div className="form-control w-full max-w-xs">
        <label htmlFor="name" className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="input input-bordered w-full max-w-xs"
          required
          value={name}
          onChange={onChange}
        />
      </div>
      <button className="btn btn-primary w-fit" disabled={!name} type="submit">
        Add new
      </button>
    </form>
  );
};

export default AddForm;

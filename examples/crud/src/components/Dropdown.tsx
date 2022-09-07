import { memo } from 'react';

type Value = number;

type Props = {
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
  [x: string]: any;
};

const Dropdown = ({ value, options, onChange, ...rest }: Props) => {
  const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    onChange(parseInt(e.target.value));
  };
  return (
    <select value={value} onChange={changeHandler} {...rest}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default memo(Dropdown);

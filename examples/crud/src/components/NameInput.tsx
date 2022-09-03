type Props = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const NameInput = ({ value, onChange }: Props) => (
  <input type="text" id="name" name="name" className="input input-bordered w-full max-w-xs" required value={value} onChange={onChange} />
);

export default NameInput;

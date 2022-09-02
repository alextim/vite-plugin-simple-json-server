type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
};

const IconButton = ({ children, onClick, disabled = false }: Props) => {
  return (
    <button type="button" className={'btn btn-square btn-outline'} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default IconButton;

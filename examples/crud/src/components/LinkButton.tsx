type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
};

const LinkButton = ({ children, onClick, disabled = false }: Props) => {
  return (
    <button type="button" className={'btn btn-link'} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default LinkButton;

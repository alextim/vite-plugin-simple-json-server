import Spinner from './Spinner';

type Props = {
  open: boolean;
  onCancel: () => void;
};

const Loading = ({ open, onCancel }: Props) => {
  const onCancelClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onCancel();
  };
  return (
    <div className={`modal${open ? ' modal-open' : ''}`}>
      <div className="modal-box flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg">Processing request</h3>
        <p className="py-4">Please wait...</p>
        <div className="py-4">
          <Spinner />
        </div>
        <button type="button" className="btn w-fit" onClick={onCancelClick}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Loading;

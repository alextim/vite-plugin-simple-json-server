const Spinner = () => (
  <div className="relative h-12 w-12">
    <div className="w-12 h-12 rounded-full absolute  border-4 border-solid border-gray-200"></div>
    <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-green-500 border-t-transparent"></div>
  </div>
);

export default Spinner;

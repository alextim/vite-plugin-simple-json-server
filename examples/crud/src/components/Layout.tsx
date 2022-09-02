type Props = {
  children?: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="p-8 bg-slate-50">
      <div className="container mx-auto">
        <h1 className="text-center font-bold text-4xl">JSON Simple Server (CRUD)</h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;

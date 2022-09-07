type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-slate-50 h-screen">
      <div className="grid grid-rows-[auto_1fr] container py-8 mx-auto min-h-full">
        <h1 className="text-center font-bold text-4xl">JSON Simple Server (CRUD)</h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;

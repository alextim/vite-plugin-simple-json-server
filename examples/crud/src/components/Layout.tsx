type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-slate-50 h-screen">
      <div className="grid grid-rows-[auto_1fr] container py-8 mx-auto min-h-full">
        <div>
          <h1 className="text-center font-bold text-4xl">Simple JSON Server (CRUD)</h1>
          <a href="/api/v3/openapi" className="btn btn-link mt-8">
            OpenAPI (Swagger UI)
          </a>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;

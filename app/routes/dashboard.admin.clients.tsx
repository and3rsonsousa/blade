import { Link, Outlet } from "@remix-run/react";

export default function ClientsPages() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="w-full border-b p-4">
        <h2 className="m-0">
          <Link to="/dashboard/admin/clients">Clientes</Link>
        </h2>
      </div>
      <Outlet />
    </div>
  );
}

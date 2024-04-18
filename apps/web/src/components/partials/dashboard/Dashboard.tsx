// import { Outlet } from "react-router-dom";

interface DashboardProps {
  routes: Map<
    string,
    {
      view: () => JSX.Element;
    }
  >;
}

export default function Dashboard({
  children,
  routes,
}: React.PropsWithChildren<DashboardProps>) {
  return <div id="Hi-im-dashboard">{children}</div>;
}

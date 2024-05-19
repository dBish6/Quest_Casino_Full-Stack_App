import { Outlet } from "react-router-dom";

import s from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={s.container}>
      <h1>Quest Casino</h1>
      <Outlet />
    </div>
  );
}

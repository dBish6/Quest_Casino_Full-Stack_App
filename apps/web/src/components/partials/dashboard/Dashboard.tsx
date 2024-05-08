import { Outlet } from "react-router-dom";
import HistoryProvider from "@utils/History";
import s from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <>
      <HistoryProvider />

      <div className={s.container}>
        <h1>Quest Casino</h1>
        <Outlet />
      </div>
    </>
  );
}

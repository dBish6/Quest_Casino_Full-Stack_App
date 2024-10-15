import { Outlet, useLocation, Link } from "react-router-dom";

import NavAside from "./aside/Aside";
import { ChatAside } from "@chatFeat/components/dashboard";

import { Blob, Image, Icon } from "@components/common";
import { ModalTrigger } from "@components/modals";
import { ScrollArea } from "@components/scrollArea";

import logoTitle from "/images/logo-title.svg";
import s from "./dashboard.module.css";

export interface DashboardProps extends React.ComponentProps<"main"> {
  scrollable?: boolean;
}

export default function Dashboard() {
  return (
    <div className={s.dashboard}>
      <Header />
      <NavAside />
      <ChatAside />

      <Outlet />
    </div>
  );
}

export function Header() {
  const location = useLocation();

  return (
    <header id="dashHeader" className={s.header}>
      <Blob svgWidth="329.838px" svgHeight="65.308px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 329.838 65.308"
          preserveAspectRatio="xMidYMin meet"
        >
          <path
            d="M34 0c7.963 0 128.815 2.2 128.815 2.2s143.043-6.628 153.261 7.57 32.731 40.893-18.9 53.23c-32.279 7.713-142.529-6.38-142.529-6.38S41.8 63 34 63C15.224 63 0 48.9 0 31.5S15.224 0 34 0Z"
            fill="rgba(178,67,178,0.5)"
          />
        </svg>
      </Blob>
      <div className={s.inner}>
        <div>
          <Link to="/home">
            <Image src={logoTitle} alt="Quest Casino Home" load={false} />
          </Link>
          <span />
          {/* TODO: */}
          <h1>About</h1>
        </div>
        
        <div>
          <ModalTrigger
            queryKey="cash"
            buttonProps={{ intent: "primary", size: "xl" }}
          >
            Cash In
          </ModalTrigger>
          <ModalTrigger
            queryKey="menu"
            buttonProps={{ intent: "primary", size: "xl", iconBtn: true }}
          >
            <Icon id="scroll-28" />
          </ModalTrigger>
          <ModalTrigger
            queryKey="notif"
            buttonProps={{ intent: "primary", size: "xl", iconBtn: true }}
          >
            <Icon id="bell-25" />
          </ModalTrigger>
        </div>
      </div>
    </header>
  );
}

export function Main({
  children,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"main">>) {
  return (
    <main {...props}>
      <ScrollArea scrollbarSize="5" orientation="vertical">
        {children}
      </ScrollArea>
    </main>
  );
}

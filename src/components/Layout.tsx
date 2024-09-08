import {ReactNode} from "react";
import MenuList from "./Menu";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const Layout = ({children, isAuthenticated}: LayoutProps) => {
  return (
    <div className='layout'>
      {children}
      {isAuthenticated && <MenuList />}
    </div>
  );
};

export default Layout;

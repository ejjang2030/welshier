import {ReactNode} from "react";
import MenuList from "./Menu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <div className='layout'>
      {children}
      <MenuList />
    </div>
  );
};

export default Layout;

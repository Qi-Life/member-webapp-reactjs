import { ReactNode, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '~/components/context/AppProvider';


function navLinkClasses(isActive: boolean, isMobile: boolean) {
  let commonClasses = 'block text-sm text-[#FFF] p-2  text-sm ';
  if (isMobile) {
    return `${commonClasses} ${isActive ? ' ' : 'hover:text-[#FFF] transition duration-300'}`;
  }
  commonClasses = 'transition duration-300';
  return `${commonClasses} ${isActive
    ? 'text-[#FFF] last:min-w-[50px]'
    : `text-[#FFF]  `
    }`;
}

type NavItemProps = {
  children: ReactNode;
  href: string;
  isMobile?: boolean;
  target?: boolean | undefined;
  isExternal?: boolean | false
};

export default function NavItem({ children, href, isMobile = false, target, isExternal = false }: NavItemProps) {
  const location = useLocation();
  const { setIsMenuOpen } = useContext(AppContext);
  const isActive = href === location.pathname;

  const item = isExternal ? <a href={href} rel="noopener" className={navLinkClasses(isActive, isMobile)}>
    {children}
  </a> : <NavLink
    to={href}
    target={target ? '_blank' : ''}
    rel="noopener"
    className={({ isActive }) => navLinkClasses(isActive, isMobile)}
  >
    {children}
  </NavLink>


  const item2 = (
    <a href={href} target={target ? '_blank' : ''} rel="noopener" className={navLinkClasses(isActive, isMobile)}>
      {children}
    </a>
  );

  return isMobile ? (
    <li onClick={() => setIsMenuOpen(false)} className={`text-transform: uppercase  duration-300  hover:bg-[#111] `}>
      {target ? item2 : item}
    </li>
  ) : target ? (
    item2
  ) : (
    item
  );
}

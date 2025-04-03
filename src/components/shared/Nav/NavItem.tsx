import { ReactNode, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '~/components/context/AppProvider';


function navLinkClasses(isActive: boolean, isMobile: boolean) {
  let commonClasses = 'block text-sm text-[#D2B96D] p-2  text-[12px] ';
  if (isMobile) {
    return `${commonClasses} ${isActive ? ' ' : 'hover:text-[#D2B96D] transition duration-300'}`;
  }
  commonClasses = ' hover:text-[#D2B96D] transition duration-300';
  return `${commonClasses} ${isActive
    ? 'text-[#D2B96D] font-bold underline decoration-[1.5px] underline-offset-[16px] decoration-[#409f83]  last:min-w-[50px]'
    : `text-[#D2B96D] font-bold hover:underline hover:underline-offset-1 hover:decoration-[1px] hover:decoration-[#D2B96D] duration-300 last:min-w-[50px] font-xs `
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
  const { setIsMenuOpen } = useContext(AuthContext);
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

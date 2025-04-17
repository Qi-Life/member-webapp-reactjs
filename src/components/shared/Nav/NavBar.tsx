/* global VoidFunction */
import { ReactNode, useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

import Logo from '~/components/shared/Logo/Logo';
import NavItem from '~/components/shared/Nav/NavItem';

import LogoMobile from '../Logo/LogoMobile';
import DownIcon from '../Icons/DownIcon';
import {
    isLogined,
  deleteAccessToken,
  deleteUserAndPasswordLocal,
  getAccessToken,
  getInfoUser,
  setUserAndPasswordLocal,
} from '~/helpers/token';
import { AuthStatus } from '~/components/context/AppProvider';
import { AuthContext } from '~/components/context/AppProvider';
import { getUser } from '~/services/AuthServices';
import NotificationDropdown from '../Notification';
import { NotificationContext } from '~/components/context/NotificationProvider';
import { useAudio } from '~/components/context/AudioProvider';
import { deleteThread } from '../Chatbot/OpenAIService';
import { clearUserData } from '~/configs/localstore';

let navigation = [
  { name: 'Frequencies', href: '/' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Shop', href: 'https://qilifestore.com/shop', target: true },
  { name: 'Reviews', href: 'https://qilifestore.com/pages/reviews', target: true },
  { name: 'Videos', href: '/video' },
  { name: 'Help', href: 'https://help.qilifestore.com/en-US', target: true },
  { name: 'Join Now', href: 'https://www.qicoil.com/pricing/', target: false, isExternal: true },
  { name: 'Login', href: '/login' },
];
let navigationMobile = [
  { name: 'Frequencies', href: '/' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Shop', href: 'https://qilifestore.com/shop', target: true },
  { name: 'Reviews', href: 'https://qilifestore.com/pages/reviews', target: true },
  { name: 'Videos', href: '/video' },
  { name: 'Help', href: 'https://help.qilifestore.com/en-US', target: true },
];
let navigationToken = [
  { name: 'Frequencies', href: '/' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Shop', href: 'https://qilifestore.com/shop', target: true },
  { name: 'Reviews', href: 'https://qilifestore.com/pages/reviews', target: true },
  { name: 'Videos', href: '/video' },
  { name: 'Help', href: 'https://help.qilifestore.com/en-US', target: true },
  { name: 'Join Now', href: 'https://www.qicoil.com/pricing/', target: false, isExternal: true },
  { name: 'Notification', href: "_notify" },
];
let navigationMobileToken = [
  { name: 'Frequencies', href: '/' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Shop', href: 'https://qilifestore.com/shop', target: true },
  { name: 'Reviews', href: 'https://qilifestore.com/pages/reviews', target: true },
  { name: 'Videos', href: '/video' },
  { name: 'Help', href: 'https://help.qilifestore.com/en-US', target: true },
];

function navItems(isMobile = false) {
  const [isOpenNotify, setIsOpenNotify] = useState(false)
  const {
    notifications,
    fetchNotification
  } = useContext(NotificationContext);

  useEffect(() => {
    fetchNotification(5)
  }, [])

  return (!isLogined() ? navigation : navigationToken).map((item) => {
    if(item.name == 'Login'){
      return (
        <NavItem key={item.name} href={item.href} target={item?.target} isMobile={isMobile} isExternal={item.isExternal}>
          <span className='px-[2.25rem] py-[0.875rem]'>{item.name}</span>
        </NavItem>
      )
    }
    else if (item.href != "_notify") {
      return (
        <NavItem key={item.name} href={item.href} target={item?.target} isMobile={isMobile} isExternal={item.isExternal}>
          <span className='px-[0.75rem] py-[0.875rem] hover:underline decoration-2 underline-offset-[0.75rem]'>{item.name}</span>
        </NavItem>
      )
    } else {
      return (<div key={item.name} onClick={() => setIsOpenNotify(!isOpenNotify)}>
        <button className="relative z-10 block rounded-md bg-white p-2 focus:outline-none">
          <div className="relative">
            <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {
              notifications?.find((n: any) => n.is_read == false) && <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full" />
            }
          </div>
        </button>
        <NotificationDropdown isOpen={isOpenNotify} />
      </div>)
    }
  });
}
function navItemsMobile(isMobile = false) {
  const navigate = useNavigate()
  const {
    notifications,
    fetchNotification
  } = useContext(NotificationContext);

  useEffect(() => {
    fetchNotification(5)
  }, [])

  return (!isLogined() ? navigationMobile : navigationMobileToken).map(
    (item) => {
      if (item.href == "_notify") {
        return (<li key={item.name} onClick={() => navigate('/profile')} className='flex justify-center'>
          <button className="relative z-10 block rounded-md bg-white p-2 focus:outline-none">
            <div className="relative">
              <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {
                notifications?.find((n: any) => n.is_read == false) && <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full" />
              }
            </div>
          </button>
        </li>)
      } else {
        return (
          <NavItem key={item.name} href={item.href} target={item?.target} isMobile={isMobile} >
            {item.name}
          </NavItem>
        )
      }
    }
  );
}

function PrimaryNavbar() {
  const { setIsMenuOpen, setStatusUser } = useContext(AuthContext);
  
  const handleClickLogo = () => {
    setIsMenuOpen(false);
    setStatusUser(false);
  };

  return (
    <div onClick={() => handleClickLogo()} className="flex items-center">
      <NavItem href="/">
        <div className="md:block hidden">
          <Logo />
        </div>
        <div className="md:hidden block">
          <LogoMobile />
        </div>
      </NavItem>
    </div>
  );
}
function MenuChildren(props: any) {
  const navigate = useNavigate();
  const { isOpenChild } = props;
  const {
    clearAll,
  } = useAudio();

  const { chatbotThread, setChatbotThread } = useContext(AuthContext)

  const handleLogOut = async () => {
    try {
      let thread = chatbotThread;
      if (thread && thread != 'undefined') {
        try {
          await deleteThread(thread)
        } catch (error) { }
      }
      clearAll()
      deleteAccessToken();
      deleteUserAndPasswordLocal();
      clearUserData()
      setChatbotThread(null);
      navigate('/login');
    } catch (error) {
      console.log("🚀 ~ handleLogOut ~ error:", error)
    }
  };

  return (
    <>
      <div
        className={`${isOpenChild ? 'visible ' : 'invisible opacity-0'
          }  absolute bg-white z-100 top-[50px] -right-1 md:-right-[33%] rounded-md `}
      >
        <div className={`shadow-lg border-1 border-black relative `}>
          <div
            className={`${isOpenChild ? 'visible ' : 'invisible'
              } w-3 h-3 bg-white absolute rotate-[135deg] -top-1 left-[170px] md:left-[165px]  `}
          ></div>
          <ul className="pt-[7px] pb-[12px] pl-[1px] min-w-[200px] w-full  mx-auto text-left">
            <li className="text-xs  w-full  hover:bg-[#E9ECEF] hover:underline duration-200">
              <NavLink to="/profile" className="text-black h-full w-full block px-[10px] py-2">
                My Profile
              </NavLink>
            </li>
            <li className="text-xs  w-full  hover:bg-[#E9ECEF] hover:underline duration-200">
              <NavLink to="/change-password" className="text-black h-full w-full block px-[10px] py-2">
                Change Password
              </NavLink>
            </li>
            <li
              onClick={() => handleLogOut()}
              className="text-xs  w-full  hover:bg-[#E9ECEF] hover:underline duration-200"
            >
              <NavLink to="/login" className="text-black h-full w-full block px-[10px] py-2">
                Sign Out
              </NavLink>
            </li>
          </ul>
          <div className="w-screen h-[calc(100vh-55px)] bg-black bg-opacity-30 fixed top-[55px] left-0 right-0 -z-50"></div>
        </div>
      </div>
    </>
  );
}

function SecondaryNavbar(props: any) {
  const { setIsOpenChild, isOpenChild } = props;
  let initGoogleTranslate = false;

  const handleClickUser = () => {
    setIsOpenChild(!isOpenChild);
  };

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  useEffect(() => {
    if (!initGoogleTranslate) {
      var addScript = document.createElement('script');
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
      initGoogleTranslate = true;
    }
  }, []);

  return (
    <div className="flex items-center">
      <div className="hidden lg:flex items-center font-medium leading-[20px] tracking-[0.1px]">{navItems()}</div>
      <div className="!hidden md:flex items-center space-x-3 ">
        <AuthStatus />
      </div>
      {!isLogined() ? (
        <></>
      ) : (
        <>
          <div className="hidden lg:block ">
            <div className=" flex items-center justify-center shadow-md">
              <div
                onClick={() => handleClickUser()}
                className={`bg-clmenu relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer`}
              >
                <span className="text-black font-bold text-[10px] p-1 overflow-hidden truncate">
                  {getInfoUser() === null ? '' : getInfoUser()?.substring(0, 2)?.toUpperCase()}
                </span>
                <DownIcon />
                <MenuChildren isOpenChild={isOpenChild} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MobileMenuButton() {
  const { statusUser, setStatusUser, setIsMenuOpen, isMenuOpen, isOpenChild, setIsOpenChild } = useContext(AuthContext);
  const {
    notifications,
  } = useContext(NotificationContext);
  const navigate = useNavigate()

  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setStatusUser(false);
  };

  const handleClickUser = () => {
    setStatusUser(!statusUser);
    setIsMenuOpen(false);
    setIsOpenChild(!isOpenChild);
  };


  return (
    <div className="lg:hidden w-[53%] flex items-center justify-between">
      <button className="outline-none mobile-menu-button" onClick={() => handleClickMenu()}>
        <svg
          className=" w-8 h-8 text-clmenu  "
          x-show="!showMenu"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {isLogined() ? (
        <>
          <div className='flex items-center'>
            <button className="relative z-10 block rounded-md bg-white p-2 focus:outline-none" onClick={() => navigate('/profile')}>
              <div className="relative">
                <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {
                  notifications?.find((n: any) => n.is_read == false) && <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full" />
                }
              </div>
            </button>
            <div
              onClick={() => handleClickUser()}
              className="bg-clmenu relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ml-4 "
            >
              <span className="text-black font-bold text-[10px] p-1 overflow-hidden truncate">
                {getInfoUser() === null ? '' : getInfoUser()?.substring(0, 2)?.toUpperCase()}
              </span>
              <DownIcon />
              <MenuChildren isOpenChild={isOpenChild} />
            </div>
          </div>
        </>
      ) : (
        <div className="duration-300 ease-in cursor-pointer relative " onClick={() => handleClickUser()}>
          <FaUserCircle
            color="#D2B96D"
            size={32}
            className={`${statusUser ? 'text-clgreen' : 'text-white'}  hover:text-clgreen duration-300`}
          />
          <div
            className={`${statusUser ? 'opacity-100' : 'opacity-0 invisible'
              } before:block before:absolute before:w-2 before:h-2 before:rotate-[135deg]	 before:bg-white before:right-3 before:top-8 `}
          >
            <ul
              className={`${statusUser ? 'opacity-100' : 'opacity-0 invisible'
                }  absolute top-9 -right-1 py-1 bg-white min-w-[150px] rounded-md shadow-md z-20 `}
            >
              <li className="p-1 pl-2 hover:text-clgreen hover:bg-[#ECF5F4] hover:underline duration-200 ease-linear">
                <NavLink className="w-full h-full block" to="/register">
                  Sign up
                </NavLink>
              </li>
              <li className="p-1  pl-2 hover:text-clgreen hover:bg-[#ECF5F4] hover:underline duration-200 ease-linear">
                <NavLink className="h-full w-full block" to={'/login'}>
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
          {statusUser && (
            <div className="w-screen h-[calc(100vh-55px)] bg-black bg-opacity-40 fixed top-0 -z-20 left-0 right-0"></div>
          )}
        </div>
      )}
    </div>
  );
}

type MobileMenuProps = {
  isOpen: boolean;
  isOpenChild?: boolean;
  setIsOpenChild?: any;
};

function MobileMenu({ isOpen, isOpenChild, setIsOpenChild }: MobileMenuProps) {
  const { setIsMenuOpen, handleOverlayClick } = useContext(AuthContext);
  const location = useLocation();
  const handleClickUserMobile = () => {
    setIsOpenChild(!isOpenChild);
  };

  useEffect(() => {
    if (isOpen) {
      setIsMenuOpen(false);
    }
  }, [location]);

  return (
    <div
      className={`bg-black duration-300 ease-linear absolute z-10 shadow-lg text-center w-full md:hidden  
      ${isOpen ? `  visible overflow-y-clip h-[260px]  ` : 'invisible overflow-hidden  h-0'} `}
    >
      <ul>{navItemsMobile(true)}</ul>
      <div
        onClick={(e) => handleOverlayClick(e)}
        className="h-[calc(100vh-55px)] w-screen bg-black fixed top-[55px] -z-20 bg-opacity-30"
      ></div>
    </div>
  );
}

type NavContainerProps = {
  children: ReactNode;
  isMenuOpen: boolean;
  isOpenChild?: boolean;
  setIsOpenChild?: any;
};

function NavContainer({ children, isMenuOpen, setIsOpenChild, isOpenChild }: NavContainerProps) {
  return (
    <nav className="shadow-lg bg-[#2A4C4F]  w-full z-50 fixed top-0 right-0 left-0 ">
      <div className="px-[1rem] py-[0.5rem] w-full">
        <div className="flex justify-between h-full ">{children}</div>
      </div>

      <MobileMenu isOpen={isMenuOpen} setIsOpenChild={setIsOpenChild} isOpenChild={isOpenChild} />
    </nav>
  );
}

export default function NavBar() {
  const { isMenuOpen, isOpenChild, setIsOpenChild, setIsMenuOpen } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    getUser()
      .then(({ data }) => {
        setUserAndPasswordLocal(data);
      })
      .catch((err) => {
        deleteUserAndPasswordLocal();
      });
  }, [location]);

  return (
    <NavContainer isMenuOpen={isMenuOpen} isOpenChild={isOpenChild} setIsOpenChild={setIsOpenChild}>
      <PrimaryNavbar />
      <SecondaryNavbar isOpenChild={isOpenChild} setIsOpenChild={setIsOpenChild} />
      <MobileMenuButton />
    </NavContainer>
  );
}

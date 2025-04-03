import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../../services/AuthServices';
import { setAccessToken, setUserAndPasswordLocal, getAccessToken, isLogined } from '../../helpers/token';
import { AuthContext } from '../context/AppProvider';
import Head from '../shared/Head';
import LoadingButton from '../LoadingButton';
import { addDeviceTokenFCM } from '~/services/ProfileService';
import { toast } from 'react-toastify';
import { useAudio } from '../context/AudioProvider';

export default function Login() {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AuthContext);
  const [inforUser, setInforUser] = useState({ email: '', password: '', rememberMe: false });
  const [notifications, setNotifications] = useState({ email: '', password: '', note: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    clearAll,
    trackListRef
  } = useAudio();


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value.trim();
    setInforUser({ ...inforUser, [name]: inputValue });
    const newNotifications = { ...notifications };

    if (name === 'email') {
      newNotifications.email = !validateEmail(value)
        ? 'Please enter a valid Email Address.'
        : (newNotifications.email = value.trim() === '' ? 'Please enter Email Address.' : '');
    }
    if (name === 'password') {
      newNotifications.password =
        value.trim() === ''
          ? 'Please enter Password.'
          : (newNotifications.password = value.length < 8 ? 'Password must be at least 8 characters long.' : '');
    }
    setNotifications(newNotifications);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    setLoading(true);
    loginUser(inforUser)
      .then(async (res: any) => {
        if (res.data.user[0].token) {
          toast.success('Login successfully')
          setAccessToken(res.data.user[0].token);
          setUserAndPasswordLocal(res.data.user[0]);
          await addDeviceTokenFCM({
            os: 'web', token: localStorage.getItem('device_token')
          })
          if (searchParams.get('redirect') == 'new-password') {
            setTimeout(() => navigate(`/new-password?code=${searchParams.get('code')}`), 1000)
          } else {
            navigate('/starter-frequencies');
          }
          setLoading(false);
        } else {
          setNotifications({ ...notifications, note: res.data.user[0]?.rsp_msg });
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      })
      .catch((err: any) => {
        navigate('/login');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isLogined()) {
      navigate('/starter-frequencies');
    }
    clearAll()
    if (trackListRef) {
      trackListRef.current = [];
    }
  }, []);

  useEffect(()=>{
    if(searchParams.get('redirect') == 'new-password'){
      setTimeout(() => navigate(`/new-password?code=${searchParams.get('code')}`), 1000)
    }
  }, [searchParams.get('redirect')])

  return (
    <>
      <Head title="Login" />
      <section className="bg-white mt-[100px] dark:bg-white">
        <div className="flex flex-col items-center px-3 sm:px-6 py-8 mx-auto min-h-[calc(100vh-120px)] lg:py-0">
          <div className="w-full  md:mt-0 sm:max-w-3xl xl:p-0">
            <div className=" p-0 sm:p-6 space-y-4 md:space-y-6 ">
              <h1 className="!text-[30px] text-center leading-tight tracking-tight text-[#333333] md:text-2xl mb-[48.6px]">
                QUANTUM & RIFE FREQUENCY WEBAPP (BETA)
              </h1>
              {notifications.note && (
                <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications.note}</p>
              )}
              <div className="space-y-4 md:space-y-6 max-w-[550px]  mx-auto">
                <input
                  onChange={(e) => handleChange(e)}
                  type="email"
                  name="email"
                  id="email"
                  className="outline-none text-gray-900 placeholder:text-gray-900 font-medium sm:text-sm dark:bg-inherit block w-full p-2.5 border-b-[#059F83] border-b-2 h-[34px]"
                  placeholder="Email"
                />
                {notifications.email && (
                  <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications.email}</p>
                )}

                <input
                  onChange={(e) => handleChange(e)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="outline-none text-gray-900 dark:bg-inherit placeholder:text-gray-900 font-medium sm:text-sm  block w-full p-2.5 border-b-[#059F83] border-b-2 h-[34px] "
                  value={inforUser.password}
                />
                {notifications.password && (
                  <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications.password}</p>
                )}
                <div className="mb-4">
                  <label htmlFor="rememberMe" className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      // checked={inforUser.rememberMe}
                      onChange={(e) => handleChange(e)}
                      className="mr-2 leading-tight dark:bg-inherit"
                    />
                    <span className="text-sm">Remember Me</span>
                  </label>
                </div>

                <button
                  onClick={() => handleSubmit()}
                  disabled={notifications.email !== '' || notifications.password !== '' ? true : false}
                  type="button"
                  className="flex items-center justify-center  w-full sm:h-[63px] text-white text-base sm:text-[28px] font-bold bg-[#059f83] mx-auto   hover:opacity-90 shadow-lg  rounded-lg py-2.5 text-center"
                >
                  {loading ? <LoadingButton /> : <></>}

                  <span className="ml-2">Sign in</span>
                </button>
                <p className="text-sm text-center font-medium text-[#059f83]">
                  Don&apos;t have an account?{' '}
                  <a href="register" className="font-semibold text-primary-600 underline">
                    Sign up
                  </a>
                  <br />
                  <a href="forgot" className="font-semibold text-primary-600 underline text-[#059f83]">
                    Forgotten Password?
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

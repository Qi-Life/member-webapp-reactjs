import React, { FormEvent, useState, useContext } from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import freeFrequencyBundles from '../../assets/img/image/free_frequency_bundles.png';
import Head from '../shared/Head';
import { loginUser, registerUser } from '../../services/AuthServices';
import { AuthContext } from '../context/AppProvider';
import LoadingButton from '../LoadingButton';
import { setAccessToken, setUserAndPasswordLocal } from '~/helpers/token';
import { trackFacebookEvent } from '~/helpers/fbq';

export default function Register() {
  const navigate = useNavigate();
  const [inforRegister, setInforRegister] = useState({ name: '', email: '', password: '' });
  const { loading, setLoading } = useContext(AuthContext);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    name: '',
    email: '',
    password: '',
    note: '',
  });
  // const from = (location.state as LocationState)?.from?.pathname || '/';
  const validateEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target;
    setInforRegister({ ...inforRegister, [name]: value.trim() });
    const newNotifications = { ...notifications };
    if (name === 'name') {
      newNotifications.name = value.trim() === '' ? 'Please enter name.' : '';
    }
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const resRegister = await registerUser({ name, email, password });

      if (resRegister.data.user[0].fetch_flag != -1) {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setTimeout(() => {
          loginUser({ email, password }).then((res: any) => {
            if (res.data.user[0].token) {
              trackFacebookEvent('CompleteRegistration');
              setAccessToken(res.data.user[0].token);
              setUserAndPasswordLocal(res.data.user[0]);
              navigate('/starter-frequencies');
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          });
          // navigate('/starter-frequencies');
          setRegistrationSuccess(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false);
          setNotifications({ ...notifications, note: resRegister.data.user[0]?.rsp_msg });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Head title="Register" />
      <section className="bg-white min-h-screen pt-[120px]" >
        <div className="flex flex-col items-center px-3 md:px-6 py-8 mx-auto lg:py-0">
          <div className="w-full  md:mt-0 sm:max-w-2xl xl:p-0 ">
            <div className=" space-y-4 md:space-y-6 ">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-center text-[#059f83] md:text-2xl">
                Sign Up For a Free Account
              </h1>
              <h2 className="text-xl text-[#059f83] text-center">Get 7 Meditation Frequencies FREE ($197 Value)</h2>
              <h2 className="text-xl text-[#059f83] text-center">Search 10,000+ Rife Frequencies FREE</h2>
              <img
                src={freeFrequencyBundles}
                alt="Logo"
                className="items-center mx-auto  block"
                style={{ height: '20rem' }}
              />
              {notifications.note && (
                <p className="text-red-500 text-center font-semibold !mt-2">{notifications.note}</p>
              )}
              <div>
                {registrationSuccess ? (
                  <div className="text-green-600 text-base">Registration successful! </div>
                ) : (
                  <form className="space-y-4 " onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      className="border-[#059F83] dark:bg-inherit border-b-2 text-gray-900 placeholder:text-gray-900 placeholder:font-medium sm:text-sm  focus:none outline-none block w-full p-2.5 h-[34px]"
                      placeholder="Name"
                      value={inforRegister.name}
                      onChange={(e) => handleChangeInput(e)}
                    />
                    {notifications.name && (
                      <p className="text-red-500 text-center font-semibold !mt-2">{notifications.name}</p>
                    )}

                    <input
                      type="email"
                      name="email"
                      className="border-[#059F83] dark:bg-inherit border-b-2  text-gray-900 placeholder:text-gray-900 placeholder:font-medium  sm:text-sm  focus:none outline-none block w-full p-2.5 h-[34px]"
                      placeholder="Email"
                      value={inforRegister.email}
                      onChange={(e) => handleChangeInput(e)}
                    />
                    {notifications.email && (
                      <p className="text-red-500 text-center font-semibold !mt-2">{notifications.email}</p>
                    )}

                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="border-[#059F83] dark:bg-inherit border-b-2 text-gray-900 placeholder:text-gray-900 placeholder:font-medium sm:text-sm outline-none  block w-full p-2.5 h-[34px]"
                      onChange={(e) => handleChangeInput(e)}
                      value={inforRegister.password}
                    />
                    {notifications.password && (
                      <p className="text-red-500 text-center font-semibold !mt-2">{notifications.password}</p>
                    )}

                    <button
                      disabled={
                        notifications.name !== '' || notifications.email !== '' || notifications.password !== ''
                          ? true
                          : false
                      }
                      type="submit"
                      className="w-full !mt-10 md:h-[63px] text-base md:text-[28px] font-bold text-white bg-[#059f83] mx-auto  flex items-center justify-center hover:bg-primary-700 hover:opacity-90 shadow-md
                      focus:outline-none  rounded-lg py-2.5 text-center !mb-7 "
                    >
                      {loading ? <LoadingButton /> : <></>}
                      <span className="ml-2">Sign Up</span>
                    </button>
                    <p className="text-sm text-center  text-[#059f83]">
                      Already have an account?{' '}
                      <a href="login" className="font-medium text-primary-600 underline">
                        Login
                      </a>
                      <br />
                      <a
                        href="forgot"
                        className="font-medium text-primary-600 underline text-[#059f83]"
                      >
                        Forgotten Password?
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

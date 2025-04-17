import { FormEvent, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Head from '~/components/shared/Head';

import { forgotPassword } from '~/services/AuthServices';
import { AuthContext } from '../context/AppProvider';
import LoadingButton from '../LoadingButton';

export default function Forgot() {
  const [notification, setNotification] = useState('');
  const { loading, setLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  // const from = (location.state as LocationState)?.from?.pathname || '/';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    try {
      const res = await forgotPassword(email);
      if (res.data.user[0].rsp_msg === 'Email Sent, Please check your spam folder too') {
        setTimeout(() => {
          setLoading(false);
          setEmail('');
        }, 300);
        setTimeout(() => {
          setNotification('Email Sent, Please check your spam folder too');
        }, 800);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 300);
        setTimeout(() => {
          setNotification('Email not found. Please try again.');
        }, 800);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      setTimeout(() => {
        setNotification('An error occurred. Please try again later.');
      }, 800);
    }

    // auth.signin(username, () => {
    //   // Sends the user back to the page he tried to visit
    //   // when he was redirected to the login page.
    //   // navigate(from, { replace: true });
    // });
  };
  const validateEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: any) => {
    setEmail(e.target.value);
    if (e.target.value === '') {
      setNotification('Please enter Email Address.');
    } else if (!validateEmail(e.target.value)) {
      setNotification('Please enter a valid Email Address.');
    } else {
      setNotification('');
    }
  };

  return (
    <>
      <Head title="Forgot" />
      <section className="bg-white min-h-screen pt-[120px]">
        <div className="flex flex-col items-center px-2 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full md:mt-0 sm:max-w-xl ">
            <div className="gap-[2.313rem] flex flex-col items-center">
              <h1 className="text-[2rem] text-center font-semibold leading-tight tracking-tight text-[#000000] sm:text-3xl">
                Reset Your Password
              </h1>
              <form
                className="space-y-[0.625rem] w-auto md:w-[27.375rem] bg-[#C5E9ED] p-[1.25rem] rounded-[0.875rem]"
                onSubmit={handleSubmit}
              >
                <label htmlFor="email" className="text-[1rem] text-[#000000] font-medium">
                  Your email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className=" text-gray-900 rounded-md dark:bg-inherit placeholder:text-gray-900 placeholder:font-medium outline-none sm:text-sm  block w-full p-2.5 h-[3rem] "
                  value={email}
                  onChange={(e) => handleChange(e)}
                />
                {notification && <p className="text-[#ED3E4E] text-[0.75rem]">{notification}</p>}

                <button
                  disabled={notification !== ''}
                  type="submit"
                  className=" !mt-[1.563rem] text-[1.25rem]  text-white bg-[#00565B] mx-auto  flex items-center justify-center hover:bg-primary-700  rounded-lg py-2  px-3.5 text-center"
                >
                  {loading ? <LoadingButton /> : <></>}
                  <span className="">Reset my password</span>
                </button>
              </form>
              <p className="text-[1rem] text-center font-medium  text-[#000000]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#6C5E0D] underline">
                  Sign In
                </Link>
              </p>
              {/* <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <button type="submit">Submit</button>
              </form> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

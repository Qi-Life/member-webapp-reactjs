import React, { useState, useContext, useEffect } from 'react';
import { newPassword } from '~/services/AuthServices';
import { AuthContext } from '../context/AppProvider';
import LoadingButton from '../LoadingButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isLogined } from '~/helpers/token';
import Head from '../shared/Head';

const NewPasswordScreen = () => {
  const { firstLogin, loading, setLoading } = useContext(AuthContext);
  const [inputFields, setInputFields] = useState({ confirm_password: '', password: '', old_password: '' });
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const newInputFields = {
      ...inputFields,
      [name]: value.trim(),
    };
    setInputFields(newInputFields);
    validateForm(newInputFields);
  };

  const validateForm = (formInput: any = inputFields) => {
    const errorChecks: any = {};
    setMsg('');
    setErrorMsg('');

    if (formInput.password.length < 8) {
      errorChecks.password = 'password must be at least 8 characters long';
      setErrorMsg(errorChecks.password);
      return false;
    }
    return true;
  };

  const handleAfterSubmitSuccess = () => {
    setTimeout(() => {
      if (isLogined()) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }, 2000);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (errorMsg || inputFields.password == '') return;
    const params = {
      password: inputFields.password,
      code: searchParams.get('code'),
    };

    try {
      setLoading(true);
      await newPassword(params);
      toast('New password successfully');
      setLoading(false);
      handleAfterSubmitSuccess();
    } catch (error) {
      toast.error('Code Expired Time');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head title="new-password" />
      <div className="w-screen h-[calc(100vh-79px)] bg-white  pt-[120px] ">
        <div className=" gap-[2.313rem] flex flex-col items-center">
          <h1 className="text-[2rem] text-center font-semibold leading-tight tracking-tight text-[#000000] sm:text-3xl">
            New Password
          </h1>
          <div className="w-full sm:w-[500px] h-auto p-4  bg-white mx-auto">
            {msg != '' && <p className="text-green-800 bg-green-50 mb-4 p-4  text-sm rounded-lg">{msg}</p>}

            <form className="w-auto md:w-[27.375rem] bg-[#C5E9ED] p-[1.25rem] rounded-[0.875rem]">
              <div className="py-2">
                <div className="space-y-[10px]">
                  <label htmlFor="password" className="text-[1rem] text-[#000000] font-medium">
                    Your new password
                  </label>
                  <div className="relative h-[3rem]">
                    <input
                      name="password"
                      id="password"
                      value={inputFields.password}
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter Password"
                      type={showPassword ? 'text' : 'password'}
                      className=" text-gray-900 rounded-md dark:bg-inherit placeholder:text-gray-900 placeholder:font-medium outline-none sm:text-sm  block w-full p-2.5 h-[3rem] "
                    />
                    <div className="absolute top-[50%] transform -translate-y-[50%] inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <svg
                        className={`h-6 text-gray-700 ${showPassword ? 'hidden' : 'block'}`}
                        onClick={togglePasswordVisibility}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                        />
                      </svg>
                      <svg
                        className={`h-6 text-gray-700 ${showPassword ? 'block' : 'hidden'}`}
                        onClick={togglePasswordVisibility}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07a32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {errorMsg != '' && <p className="text-[#ED3E4E] text-[0.75rem] mt-[0.625rem]">{errorMsg}</p>}
              </div>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="mt-[1.563rem] text-[1.25rem]  text-white bg-[#00565B] mx-auto  flex items-center justify-center hover:bg-primary-700  rounded-lg py-2  px-3.5 text-center"
                type="button"
              >
                {loading && <LoadingButton />}
                <span>Submit </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPasswordScreen;

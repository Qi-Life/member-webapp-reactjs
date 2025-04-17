import React, { useEffect, useState, useContext } from 'react';
import { changePassword } from '~/services/AuthServices';
import { AppContext } from '../context/AppProvider';
import LoadingButton from '../LoadingButton';

const ChangePassword = () => {
  const { userID, loading, setLoading } = useContext(AppContext);
  const [errors, setErrors] = useState(Object);
  const [inputFields, setInputFields] = useState({ confirm_password: '', password: '', old_password: '' });
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const newInputFields = {
      ...inputFields, [name]: value.trim()
    }
    setInputFields(newInputFields);
    validateForm(newInputFields);
  };

  const validateForm = (formInput: any = inputFields) => {
    const errorChecks: any = {}
    setMsg('');
    setErrorMsg('');
    if (formInput.old_password.trim() == '') {
      errorChecks.old_password = 'Old password is required'
    }
    if (formInput.password.length < 8) {
      errorChecks.password = 'password must be at least 8 characters long'
    }
    if (formInput.password != formInput.confirm_password) {
      errorChecks.confirm_password = 'Confirm password and password not match'
    }
    if (formInput.confirm_password == '') {
      errorChecks.confirm_password = 'Confirm password is required'
    }
    setErrors(errorChecks)
    return errorChecks
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const validates = validateForm()
    setErrorMsg('');
    setMsg('');
    if (JSON.stringify(validates) === '{}') {
      const params = {
        id: userID,
        old_password: inputFields.old_password,
        password: inputFields.confirm_password,
        confirm_password: inputFields.confirm_password,
      };
      try {
        setLoading(true);
        const res = await changePassword(params);
        if (res.data.fetch_flag == -1) {
          setErrorMsg(res.data.rsp_msg)
        } else {
          setMsg(res.data.user[0].rsp_msg);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-screen h-[calc(100vh-79px)] bg-white ">
      <div className="pt-[140px]">
        <h1 className="font-bold text-[30px] text-center ">Change Password</h1>
        <div className="w-full sm:w-[500px] h-auto p-4  bg-white mx-auto">
          {msg != '' && <p
            className='text-green-800 bg-green-50 mb-4 p-4  text-sm rounded-lg'>
            {msg}
          </p>}
          {errorMsg != '' &&
            <p
              className='text-red-600 bg-red-100 mb-4 p-4  text-sm rounded-lg'>
              {errorMsg}
            </p>}
          <form onSubmit={handleSubmit}>
            <div>
              <div className="mb-4">
                <input
                  placeholder="Old Password"
                  className="border-b-2 border-[#059f83]  placeholder:text-gray-900 placeholder:font-semibold  outline-none text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full py-2.5
                  dark:bg-inherit"
                  name="old_password"
                  value={inputFields.old_password}
                  onChange={(e) => handleChange(e)}
                  type="password"
                />
                {errors.old_password && (
                  <p className="text-red-500 text-center font-semibold !mt-2">{errors.old_password}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  placeholder=" New Password"
                  className="border-b-2 border-[#059f83]  placeholder:text-gray-900 placeholder:font-semibold  outline-none text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full py-2.5
                  dark:bg-inherit"
                  name="password"
                  value={inputFields.password}
                  onChange={(e) => handleChange(e)}
                  type="password"
                />
                {errors.password && (
                  <p className="text-red-500 text-center font-semibold !mt-2">{errors.password}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  placeholder="Repeat Password"
                  className="border-b-2 border-[#059f83]  placeholder:text-gray-900 placeholder:font-semibold  outline-none text-gray-900 sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full py-2.5
								  dark:bg-inherit	"
                  name="confirm_password"
                  value={inputFields.confirm_password}
                  type="password"
                  onChange={(e) => handleChange(e)}
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-center font-semibold !mt-2">{errors.confirm_password}</p>
                )}
              </div>
            </div>
            <button
              disabled={loading}
              className="mt-10 text-[28px] flex items-center justify-center font-semibold text-white bg-[#059f83] w-full h-[63px] rounded-md"
              type="submit"
            >
              {loading && <LoadingButton />}
              <span className="ml-2">Submit </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

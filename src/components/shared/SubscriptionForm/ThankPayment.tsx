import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { isLogined } from '~/helpers/token';
import BackImage from '~/assets/img/playlist/left.png';

export default function ThankPayment() {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [countdown, setCountdown] = useState(5); // Initialize countdown state

  const handleGoBack = () => {
    if (state?.appName != 'rc_app') {
      if (!isLogined()) {
        !state.register_new ? navigate('/login') : navigate(`/new-password?code=${state.user.new_password_code}`)
      } else {
        navigate(state?.gobackUrl || '/starter-frequencies')
      }
    } else {
      confirm("Goback");
    }
  };

  useEffect(() => {
    if (state?.status != 'success') {
      navigate('/starter-frequencies');
    } else {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer); // Clear interval when countdown reaches 1
            handleGoBack()
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }
  }, [state, navigate]);

  useEffect(() => {
    if (state?.appName === 'rc_app') {
      confirm("Success");
    }
  }, []);

  return (
    <>
      <div className="px-4 transform translate-y-1/2 relative mx-auto max-w-[800px]">
        <div className='absolute top-[-30px]'>
          <div onClick={handleGoBack} className="border border-black p-1.5 rounded-md shadow-md cursor-pointer inline-block">
            <img className="object-cover" src={BackImage} alt="" />
          </div>
        </div>
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center mx-auto">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">Payment Successful!</h1>
          <p className="mt-4 text-gray-600">
            Thank you for your purchase. Your transaction has been completed successfully.
          </p>
          {
            state?.register_new && <p><b>We have signed up your account automatically, please check your email and change your password later.</b> </p>
          }
          <p className="mt-4 text-gray-500">
            Redirecting in {countdown} seconds...

          </p> {/* Display countdown */}

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="mt-6 px-4 py-2 bg-[#059f83] text-white rounded hover:opacity-75"
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}

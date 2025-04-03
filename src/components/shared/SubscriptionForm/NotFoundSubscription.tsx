import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

export default function NotFoundSubscription() {
    const navigate = useNavigate();
    const { state }: any = useLocation();

    const handleGoBack = () => {
        navigate(state?.gobackUrl || '/starter-frequencies')
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <svg
                    className="mx-auto mb-4 w-16 h-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c.567 0 1.029-.442 1.077-1.004l.546-7.004a1.05 1.05 0 00-1.047-1.116H4.415a1.05 1.05 0 00-1.047 1.116l.546 7.004c.048.562.51 1.004 1.077 1.004z"></path>
                </svg>
                <h1 className="text-2xl font-semibold text-gray-800">Subscription Not Found</h1>
                <button
                    onClick={handleGoBack}
                    className="mt-6 px-4 py-2 bg-[#d9534f] text-white rounded hover:opacity-75"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

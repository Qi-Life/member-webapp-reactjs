const Alert = () => {
  const verify = localStorage.getItem('is_verified') ? localStorage.getItem('is_verified').replace(/[^a-zA-z+.+@ + 0-9]/g, '') : '0';
  return (
    <>
      { (verify === '0' && localStorage.getItem('userToken')) ? (
        <div className="p-4 text-sm text-center text-red bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <p className="verify_warning">
            Must verify email to play frequencies other than free ones. Didn&apos;t get the email?{' '}
            <a href="#" className="hover:underline text-[#3b82f6]" id="resend_verify">
              Resend Verification
            </a>
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Alert;

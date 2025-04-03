import React from 'react';

const Footer = () => {
  return (
    <div className="w-full h-full bg-[#222] text-[#9f9f9f] py-5 px-4">
      <div className="flex  flex-col items-center justify-center text-[13px]  mx-auto">
        <p className="mb-1 text-[8px] sm:text-[12px] ">© 2019-2023 QICOIL.COM ALL RIGHTS RESERVED</p>
        <p className="text-center mb-1 text-[8px] sm:text-[12px]">
          Disclaimer: None of the products are intended as a diagnosis, treatment, cure, prevention of any disease and
          have not been evaluated by the FDA. You should never change or stop taking any medication unless you have
          discussed the situation with your medical practitioner.
        </p>
      </div>

      <p className="text-[#D2B96D] text-center text-[8px] sm:text-[12px]">
        <a
          className="hover:underline duration-200 duration-1 hover:opacity-80"
          href="https://members.qicoil.com/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        <span className="mx-1">|</span>
        <a
          className="hover:underline duration-200 duration-1 hover:opacity-80"
          href="https://members.qicoil.com/terms-and-condition"
          target="_blank"
          rel="noreferrer"
        >
          Terms and Conditions
        </a>
        <span className="mx-1">|</span>
        <a
          className="hover:underline duration-200 duration-1 hover:opacity-80"
          href="https://members.qicoil.com/disclaimer"
          target="_blank"
          rel="noreferrer"
        >
          Disclaimer
        </a>
      </p>
    </div>
  );
};

export default Footer;

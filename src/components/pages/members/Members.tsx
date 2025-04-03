import React from 'react';

const Members = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[30px] font-bold ">My Subscriptions</h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right border text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 border">
                  Membership Name
                </th>
                <th scope="col" className="px-6 py-3 border">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 border">
                  Subscriptions Date
                </th>
                <th scope="col" className="px-6 py-3 border">
                  Renewal Date
                </th>
                <th scope="col" className="px-6 py-3 border" />
              </tr>
            </thead>
            <tbody className="bg-[#ECECEC]">
              <tr>
                <td scope="row" colSpan={5} className="p-2">
                  You do not have an active membership.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h1 className="text-[30px] font-bold ">Cancelled Subscriptions</h1>
        <div className="bg-white p-[7px]">
          <a
            className="text-[18px] leading-[54px] text-[#7b52ab] hover:underline"
            href="https://www.qicoil.com/pricing/"
            target="blank"
          >
            View all Membership Options
          </a>
        </div>
        <table className="w-full text-sm text-left rtl:text-right border text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 border">
                Membership Name
              </th>
              <th scope="col" className="px-6 py-3 border">
                Price
              </th>
              <th scope="col" className="px-6 py-3 border">
                Subscriptions Date
              </th>
              <th scope="col" className="px-6 py-3 border">
                Cancelled Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#ECECEC]">
            <tr>
              <td scope="row" colSpan={4} className="p-2">
                You do not have an Cancelled membership.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;

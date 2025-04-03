import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNotificationDetail } from '~/services/NotificationServices';


const NotificationDetail = () => {
    let { id } = useParams();

    const navigate = useNavigate()

    const [notificationState, setNotificationState] = useState({
        title: '',
        content: '',
        created_at: '',
        detail_data: []
    })

    const fetchNotificationDetail = async () => {
        const res = await getNotificationDetail(+id)
        if (res.data?.data) {
            setNotificationState(res.data.data)
        }
    }

    useEffect(() => {
        fetchNotificationDetail()
    }, [])

    return (
        <>
            <h1 className="text-2xl font-semibold mb-5">Notification Detail</h1>
            <div className="md:w-[70%]">
                <div className="h-auto p-4 border bg-white space-y-4">
                    <div className='flex justify-between'><label className='font-semibold text-slate-500'>Title</label><span className='text-slate-700'>{notificationState.created_at}</span></div>
                    <div className='p-[1rem] bg-[#eee]'><span className='ml-2 font-bold'>{notificationState.title}</span></div>

                    <div><label className='font-semibold text-slate-500'>Body</label></div>
                    <div className='p-[2rem] bg-[#eee]'><span><span dangerouslySetInnerHTML={{ __html: notificationState.content }} /></span></div>

                    {
                        notificationState.detail_data.map((d: any) => {
                            return (
                                <div className='border-b pb-2'>
                                    <div className='mb-2'><label className='font-semibold text-slate-500'>{d.title}</label></div>
                                    <div className='p-[1rem]'><span className='ml-2 flex flex-wrap'>{
                                        d.data.map((_item:any) => (
                                            <a className='bg-[#059f83] text-white mr-2 rounded-[12px] px-5 py-1 mb-2'>{_item.title || _item.name}</a>
                                        ))
                                        }</span></div>
                                 </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
};

export default NotificationDetail;

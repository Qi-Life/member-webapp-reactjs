import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { readNotification } from '~/services/NotificationServices';
import { onMessage } from "firebase/messaging";
import { messaging } from '~/firebase';
import { toast } from 'react-toastify';
import moment from 'moment';
import logoMobile from '~/assets/img/logo/logo-mobile.svg';
import { NotificationContext } from '../context/NotificationProvider';

const NotificationDropdown = ({ isOpen }: any) => {
    const {
        notifications,
        fetchNotification,
        updateNotification
      } = useContext(NotificationContext);

    const navigate = useNavigate()

    const Msg = (payload: any) => {
        return (
            <div className="n-content" >
                <div className='flex'>
                    <img src={logoMobile}/>
                    <div className='mb-2 ml-2'>
                        <p><div dangerouslySetInnerHTML={{ __html: payload.notification.data.htmlContent }} /></p>
                    </div>
                </div>
                <p className='text-center' onClick={()=> navigate(`/notifications/${payload.notification.data?.notificationId}`)}><button style={{
                    background: '#059f83',
                    borderRadius: '10px',
                    color: '#fff',
                    padding: '5px 40px'
                }}>Read more</button></p>
            </div>
        );
    };

    onMessage(messaging, (payload) => {
        toast(<Msg notification={payload} />, {
            autoClose: false,
        })
        fetchNotification(5)
    });

    const maskReadAll = async () => {
        const ids = notifications.map((item: any) => item.id)
        await readNotification({
            ids
        })
        updateNotification(notifications.map((item: any) => ({ ...item, is_read: 1 })))
    }

    const maskRead = async (item: any) => {
        await readNotification({
            ids: [item.id]
        })
        updateNotification(notifications.map((_item: any) => {
            if (item.id == _item.id) {
                return { ...item, is_read: 1 }
            }
            return _item
        }))
        navigate(`/notifications/${item.id}`, { state: { notification: item} })
    }

    return (
        <div className="w-full relative">
            <div className="absolute right-0 mr-2 flex bg-white rounded-md shadow-lg" style={{ width: '20rem' }}>
                {isOpen && <div className='flex flex-col w-full max-h-[80vh] overflow-y-auto	'>
                    <div className='px-4 py-4 flex justify-between border-b'>
                        <h1 className='font-bold text-base'>Notifications</h1>
                        <b className='cursor-pointer' onClick={maskReadAll}>Mark all as read</b>
                    </div>
                    {notifications && notifications.map((n: any) => (
                        <div className='py-4 border-b cursor-pointer' style={{
                            backgroundColor: n.is_read == 1 ? '#fff' : '#fef7f1'
                        }} onClick={() => maskRead(n)}>
                            <div className="px-4">
                                <p className="text-gray-600 text-sm mb-1">
                                    <div dangerouslySetInnerHTML={{ __html: n.content }} />
                                </p>
                                <span className='text-[#999] text-right text-xs '>{moment(new Date(n.created_at)).fromNow()}</span>
                            </div>
                        </div>
                    ))}
                    {notifications && notifications.length >= 5 && <a className="block bg-gray-800 text-white text-center font-bold py-3 cursor-pointer" onClick={() => navigate('/profile')}>See all notifications</a>}
                    {notifications && notifications.length == 0 && <a className="block text-center text-[#777] font-bold py-3 ">You have no notification now.</a>}

                </div>}
            </div>
        </div>
    );
};

export default NotificationDropdown;

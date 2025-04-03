import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificationList, readNotification } from '~/services/NotificationServices';
import { onMessage } from "firebase/messaging";
import { messaging } from '~/firebase';
import { toast } from 'react-toastify';
import moment from 'moment';
import { NotificationContext } from '~/components/context/NotificationProvider';

const NotificationList = ({ isOpen }: any) => {
  const [_notifications, setNotifications] = useState([]);
  const {
    notifications,
    updateNotification
  } = useContext(NotificationContext);

  const navigate = useNavigate()

  const getNotifications = async () => {
    const res = await getNotificationList(10000)
    setNotifications(res.data.data)
  }

  const Msg = (payload: any) => {
    return (
      <div className="n-content" >
        <div className='flex'>
          <img src="/src/assets/img/logo/logo-mobile.svg" />
          <div className='mb-2 ml-2'>
            <p><div dangerouslySetInnerHTML={{ __html: payload.notification.data.htmlContent }} /></p>
          </div>
        </div>
        <p className='text-center'><button style={{
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
    getNotifications()
  });

  const maskReadAll = async () => {
    const ids = _notifications.map((item: any) => item.id)
    await readNotification({
      ids
    })
    setNotifications(_notifications.map((item: any) => ({ ...item, is_read: 1 })))
    updateNotification(notifications.map((_item: any) => ({ ..._item, is_read: true })))
  }

  const maskRead = async (item: any) => {
    await readNotification({
      ids: [item.id]
    })
    setNotifications(_notifications.map((_item: any) => {
      if (item.id == _item.id) {
        return { ...item, is_read: 1 }
      }
      return _item
    }))
    updateNotification(notifications.map((_item: any) => {
      if (item.id == _item.id) {
        return { ...item, is_read: 1 }
      }
      return _item
    }))
    navigate(`/notifications/${item.id}`, { state: { notification: item } })
  }

  useEffect(() => {
    getNotifications()
  }, [])

  return (
    <div className="px-4 bg-white">
      <div className='flex flex-col'>
        <div className='p-4 flex justify-between border-b'>
          <h1 className='font-bold text-base'>Notifications</h1>
          <b className='cursor-pointer' onClick={maskReadAll}>Mark all as read</b>
        </div>
        <div className='max-h-[700px] overflow-y-scroll min-h-[200px]'>
          {_notifications.map((n: any) => (
            <div className='py-4 border-b cursor-pointer' style={{
              backgroundColor: n.is_read == 1 ? '#fff' : '#fef7f1'
            }} onClick={() => maskRead(n)}>
              <div className="px-6">
                <p className="text-gray-600 text-sm">
                  <div dangerouslySetInnerHTML={{ __html: n.content }} />
                </p>
                <span className='text-[#999] text-right text-xs '>{moment(new Date(n.created_at)).fromNow()}</span>
              </div>
            </div>
          ))}
          {notifications && notifications.length == 0 && <a className="block text-center text-[#777] font-bold py-3 ">You have no notification now.</a>}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;

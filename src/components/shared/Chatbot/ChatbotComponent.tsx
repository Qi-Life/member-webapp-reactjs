import { Chatbot, createChatBotMessage } from "react-chatbot-kit";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import { useContext, useEffect, useState } from "react";
import 'react-chatbot-kit/build/main.css';
import './Chatbot.css'
import chatbotButonImage from '../../../assets/img/chatbot-icon.png'
import chatbotAsk from '../../../assets/img/chat-ask.png'
import { configApp } from "~/configs/config";
import { getToken } from "~/helpers/token";
import { AuthContext } from "~/components/context/AppProvider";
import { createThread } from "./OpenAIService";

const ChatbotComponent = (props: any) => {
  const [showBot, toggleBot] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isShowAsk, setIsShowAsk] = useState(true);
  const { chatbotThread, setIsShowChatBot, setChatbotThread } = useContext(AuthContext)

  const saveMessages = (messages: any) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('chat_messages'));
    return messages
  };

  const handleShowTooltip = (status: boolean) => {
    setShowTooltip(status)
  }

  const validateInput = (e: any) => {
    return e != ''
  }

  useEffect(() => {
    if (window.document.getElementsByClassName('react-chatbot-kit-chat-btn-send').length > 0) {
      const element = window.document.getElementsByClassName('react-chatbot-kit-chat-btn-send')[0] as HTMLElement;
      element.innerHTML = `<svg width="25" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_49_278)">
            <path d="M2.0186 7.79879L0.641846 14.7008L13.1365 7.3504L0.641846 0L2.0186 6.91802H7.53859V7.79879H2.0186Z" fill="#409F83"/>
            </g>
            <defs>
            <clipPath id="clip0_49_278">
            <rect width="12.4947" height="14.7008" fill="white" transform="translate(0.641846)"/>
            </clipPath>
            </defs>
        </svg>
      `
      element.style.setProperty('background-color', '#fff', 'important');
    }
  }, [showBot, getToken(configApp.tokenKey)])

  useEffect(() => {
    let thread = localStorage.getItem('chatbot_thread')
    if (!thread || thread == 'undefined') {
      async function fetchThread() {
        const res = await createThread()
        if (res.data.code == 200 && res.data?.data.id) {
          setChatbotThread(res.data.data.id)
          localStorage.setItem('chatbot_thread', res.data.data.id)
        }
      }
      fetchThread()
    }

    setTimeout(() => {
      handleShowTooltip(true)
      setIsShowAsk(false)
    }, 2000)
  }, [])

  const checkIsLogin = () => {
    return !!getToken(configApp.tokenKey)
  }

  const handleShowChatbox = () => {
    toggleBot((prev) => {
      setShowTooltip(false)
      setIsShowChatBot(!prev)
      return !prev
    })
  }

  const handleContextMenu = (e: any) => {
    e.preventDefault();
  };



  return (
    <>
      <div className={`px-3 pb-2 chat-bot-main w-[100%] sm:w-[330px] shadow-2xl shadow-gray-800 fixed ${checkIsLogin() && showBot ? '' : 'invisible'}`}>
        <Chatbot
          actionProvider={ActionProvider}
          messageParser={MessageParser}
          config={config}
          headerText='Dr. Qi AI'
          placeholderText='Message:'
          messageHistory={loadMessages()}
          saveMessages={saveMessages}
          runInitialMessagesWithHistory
          validator={validateInput}
        />
        <div className="p-3 absolute bottom-0 text-[9px] chatbot-policy left-1/2 transform -translate-x-1/2 text-center w-full">By chatting with me, you agree to our Privacy and Cookie Policies</div>
        {<p className="text-[#047e68] text-[16px] font-bold absolute right-[10px] top-[10px] p-2 cursor-pointer " onClick={() => {
          toggleBot(false);
          setIsShowChatBot(false)
        }
        }>X</p>}
      </div>
      {checkIsLogin() && chatbotThread && <div className="fixed chat-button" style={{ bottom: '120px', right: "20px", textAlign: 'right', zIndex: 997 }}>
        <button
          onClick={() => handleShowChatbox()}
          className="relative rounded-full border-[10px] border-[#409F83] w-[80px] shadow-2xl z-2"
          onContextMenu={handleContextMenu}
        >
          <div className="relative">
            <img src={chatbotButonImage} className="rounded-full" />
            {isShowAsk && (
              <div className="absolute top-[10px] w-[24px]" >
                <img src={chatbotAsk} />
              </div>
            )}
          </div>
        </button>
        <span className="heartbeat" style={{ zIndex: -1 }}></span>
        {showTooltip && !showBot && <p className="absolute shadow-md text-[#000] bg-white c-tooltip font-bold text-[12px]" style={{ width: '200px', right: '50px', top: '-10px' }}>My name is Dr. Qi<br /> I'm an AI assistant</p>}
      </div>
      }
    </>
  );
};

export default ChatbotComponent
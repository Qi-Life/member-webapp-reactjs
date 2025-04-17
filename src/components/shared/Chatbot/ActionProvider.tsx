// in ActionProvider.jsx
import React, { useContext, useEffect, useRef } from 'react';
import ChatbotLoader from './ChatbotLoader';
import { addMessageToThread, createThread, runThread } from './OpenAIService';
import { AppContext } from '~/components/context/AppProvider';

const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
  const { chatbotThread, setChatbotThread, isShowChatbot } = useContext(AppContext)
  const hasRun = useRef(false);

  let thread = chatbotThread
  const saveMessages = (messages: any) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  };

  const _isFirstChat = () => {
    let chat_messages = localStorage.getItem('chat_messages')

    if (chat_messages) {
      chat_messages = JSON.parse(chat_messages)
      if (chat_messages.length == 0) {
        return true
      }
    }
    return false
  }

  const disableSendButton = (isDisabled: boolean) => {
    if (window.document.getElementsByClassName('react-chatbot-kit-chat-btn-send').length > 0) {
      const buttonElement = window.document.getElementsByClassName('react-chatbot-kit-chat-btn-send')[0] as HTMLButtonElement;
      buttonElement.disabled = isDisabled
      if (isDisabled) {
        // Additional logic when the button is disabled
        buttonElement.style.opacity = '0.5'; // Example: reducing opacity
        buttonElement.style.cursor = 'not-allowed'; // Example: changing cursor
      } else {
        // Additional logic when the button is enabled
        buttonElement.style.opacity = '1'; // Example: resetting opacity
        buttonElement.style.cursor = 'pointer'; // Example: resetting cursor
      }
    }
  }

  const handleShowMessage = (message: string) => {
    const speed = 20;
    let index = 1;
    const botMessage = createChatBotMessage(message[0], {
      widget: "customMessage",
    });

    setState((prev: any) => {
      const newPrevMsg = prev.messages.slice(0, -1)
      return { ...prev, messages: [...newPrevMsg, botMessage] }
    })

    const interval = setInterval(() => {
      if (message && message[index]) {
        botMessage.message = `${botMessage.message}${message[index]}`
        setState((prev: any) => {
          const newPrevMsg = prev.messages.slice(0, -1)
          if (index == message.length) {
            saveMessages([...newPrevMsg, botMessage])
            disableSendButton(false)
          }
          return { ...prev, messages: [...newPrevMsg, botMessage] }
        })
      }

      index++;
      if (index === message.length) {
        clearInterval(interval);
        disableSendButton(false)
      }
    }, speed);
    return () => clearInterval(interval);
  }

  const _handeleError = () => {
    // setState((prev: any) => {
    //   // Remove Loading here
    //   const newPrevMsg = prev.messages.slice(0, -1)
    //   return { ...prev, messages: [...newPrevMsg] }
    // })
    disableSendButton(false)
  }

  const handleInitChat = () => {
    handleDefault('Hi')
  }

  const handleDefault = async (message: string) => {
    const loading = createChatBotMessage(<ChatbotLoader />)
    disableSendButton(true);
    setState((prev: any) => ({ ...prev, messages: [...prev.messages, loading], }))

    try {
      const msRes = await addMessageToThread(thread, message)
      if (msRes.data.status == 'error') {
        if (msRes.data.code == '404') {
          localStorage.removeItem('chatbot_thread')
          localStorage.removeItem('chatbot_messages')
          setChatbotThread('')
        }
        return _handeleError()
      }

      const runThreadRes = await runThread(thread)

      if (runThreadRes.data.status == 'error') {
        return _handeleError()
      }

      if (runThreadRes?.data?.thread_id == thread) {
        handleShowMessage(runThreadRes?.data.content[0].text.value)
      }
    } catch (error) {
      _handeleError()
    }

  };

  useEffect(() => {
    if (!hasRun.current && _isFirstChat() && isShowChatbot) {
      handleInitChat()
      hasRun.current = true; 
    }
  }, [isShowChatbot])

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleDefault,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
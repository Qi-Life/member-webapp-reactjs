import React, { useEffect, useState } from 'react';

import CustomMessage from './CustomMessage';

const botName = "DR. QI AI assistant";

const init = (): any => {
  return []
}


const config = {
  botName: botName,
  initialMessages: init(),
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#047e68",
    },
  },
  customComponents: {
    botChatMessage: (props: any) => <CustomMessage {...props} />,
  },
  widgets: [
    {
      widgetName: 'customMessage',
      widgetFunc: (props: any) => <CustomMessage {...props} />,
      mapStateToProps: ['messsage'],
      props: {}
    },
  ],
};

export default config;

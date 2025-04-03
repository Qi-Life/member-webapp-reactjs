// in MessageParser.jsx

import React from 'react';

const MessageParser = ({ children, actions }:any) => {
  const parse = (message:any) => {
    const lowerCaseMessage = message.toLowerCase();
    actions.handleDefault(lowerCaseMessage);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;
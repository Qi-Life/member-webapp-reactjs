import React, { useEffect, useState } from 'react';

const linkify = (text: string) => {
    try {
        // Function to clean only unwanted special characters from URLs
        const cleanUrl = (url: string) => {
            return url.replace(/[^\w\s:/\.\-?=&%]/g, '');
        };

        // Handle the specific link case for "##Exam Stress Resource"
        let replaceText = text.replace(/\[(##.*?)\](?:\((https?:\/\/[^\s]+)\))?/g, function (match, group1, group2) {
            let group1Text = group1.replace('##', '')
            if(group1 && group2){
                return `<a href='${group2}' style="color:#047e68; font-weight: bold" target="_blank">${group1Text}</a>`;
            }
        });

        replaceText = replaceText.replace(/##[^\n]+/g, function (match: any) {
            const keyword = match.replace('##', '');
            return `<a href='/masterwong-ai?keyword=${encodeURIComponent(keyword)}' style="color:#047e68; font-weight: bold" target="_blank">${keyword}</a>`;
        });

        // Replace newlines with <br/>
        replaceText = replaceText.replace(/\n/g, '<br/>');

        return replaceText;
    } catch (error) {
        return text;
    }
};

const isReactElement = (element: any): boolean => {
    return element?.$$typeof === Symbol.for('react.element');
}

const CustomMessage = ({ message }: any) => {
    if (typeof (message) == 'object' && isReactElement(message)) {
        return <>{<div className="custom-message react-chatbot-kit-chat-bot-message">{message}</div>}</>;
    } else if (typeof (message) == 'string') {
        const renderMsg = linkify(message)
        return <>{<div className="custom-message react-chatbot-kit-chat-bot-message" dangerouslySetInnerHTML={{ __html: renderMsg }}></div>}</>;
    };
}


export default CustomMessage;

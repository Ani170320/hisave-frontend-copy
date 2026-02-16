import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  user?: string;
  bot?: string;
}

const cleanMessage = (text: string) => {
  return text.replace(/\[\d+:\d+:[^\]]+\]/g, "");
};

const ChatMessage: React.FC<Props> = ({ user, bot }) => {
  return (
    <>
      {user && (
        <div className="ai-chat-user-text-message-block">
          <div className="ai-chat-user-text-message">
            {user}
          </div>
        </div>
      )}

      {bot && (
        <div className="ai-chat-system-text-message-block">
          <div className="ai-chat-system-text-message">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {cleanMessage(bot)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
import React from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

interface Props {
  user?: string;
  bot?: string;
}

const cleanMessage = (text: string) => {
  return text.replace(/\[\d+:\d+:[^\]]+\]/g, "");
};

const ChatMessage: React.FC<Props> = ({ user, bot }) => {
  const navigate = useNavigate();

  const renderBotMessage = (message: string) => {
    const cleaned = cleanMessage(message);

    // 🔥 Handle plain "Add Card" text automatically
    if (cleaned.includes("Add Card")) {
      const parts = cleaned.split("Add Card");

      return parts.map((part, index) => (
        <React.Fragment key={index}>
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => {
                if (href && href.includes("add-card")) {
                  return (
                    <span
                      onClick={() => navigate("/add-card")}
                      style={{
                        cursor: "pointer",
                        color: "#2563eb",
                        fontWeight: 600,
                        textDecoration: "underline",
                      }}
                    >
                      {children}
                    </span>
                  );
                }

                return (
                  <a
                    {...props}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {part}
          </ReactMarkdown>

          {index < parts.length - 1 && (
            <span
              onClick={() => navigate("/add-card")}
              style={{
                cursor: "pointer",
                color: "#2563eb",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Add Card
            </span>
          )}
        </React.Fragment>
      ));
    }

    // 🔥 Normal markdown rendering
    return (
      <ReactMarkdown
        components={{
          a: ({ href, children, ...props }) => {
            if (href && href.includes("add-card")) {
              return (
                <span
                  onClick={() => navigate("/add-card")}
                  style={{
                    cursor: "pointer",
                    color: "#2563eb",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  {children}
                </span>
              );
            }

            return (
              <a
                {...props}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {cleaned}
      </ReactMarkdown>
    );
  };

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
            {renderBotMessage(bot)}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
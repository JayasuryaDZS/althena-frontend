import { User } from "lucide-react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import moment from 'moment';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300",
        isUser && "flex-row-reverse space-x-reverse"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-gray-900 dark:bg-gray-700"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <span className="text-sm font-bold text-white">AI</span>
        )}
      </div>

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-xs md:max-w-2xl shadow-sm",
          isUser
            ? "bg-blue-600 text-white ml-auto"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p
          className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          )}
        >
          { moment(message.timestamp).format('hh:mm A') }
          {/* {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} */}
        </p>
      </div>
    </div>
  );
}

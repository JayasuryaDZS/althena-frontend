import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { LoadingDots } from "@/components/LoadingDots";
import { Chat, Message } from "@/types/chat";
import { useEffect, useRef } from "react";

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatArea({ messages, onSendMessage, isLoading }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);
  // console.log(chat.messages, 'checkign the chat mesage 25 -->');
  // console.log(messages, 'chekcing the messages in the chatArea.tsx')
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 pt-16 md:pt-0">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {messages?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AI</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start a conversation and I'll be happy to assist you
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 md:px-6">
            <div className="py-4 space-y-4">
              {messages?.map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">AI</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-xs md:max-w-2xl">
                    <LoadingDots />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

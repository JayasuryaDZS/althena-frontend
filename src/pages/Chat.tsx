import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Message, Chat } from "@/types/chat";
import { userDetails } from "@/types/login";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { _post } from "@/api/apiClient";
import moment from "moment";

export const CHAT_MODE = 'affirming';
const ORG_ID = 'ZYLEN';
const INITIAL_STATE =  { _id: '', title: '', messages: [], createdAt: new Date() }

const ChatPage = () => {
  const navigate = useNavigate();
  const authenticatedDetails: userDetails = JSON.parse(localStorage.getItem('isAuthenticated'));
  const userId = authenticatedDetails._id;

  const [chats, setChats] = useState<Chat>(INITIAL_STATE);
  const [currentChatId, setCurrentChatId] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ startContinueChat, setStartContinueChat ] = useState<boolean>(false);
  const [ trackNewChat, setTrackNewChat ] = useState(false); // This state disable getAllHistory api when i click addnewchat in sidebar;

  const createNewChat = () => {
    // console.log('iam coming inside the 29 --->');
    const newChat: Chat = {
      _id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats(newChat);
    setStartContinueChat(false);
    // setCurrentChatId(newChat._id);
  };
console.log(startContinueChat, 'checking the continue chat 39 -->');
  const continueChatApi = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await _post(`/chat/${currentChatId}/continue`, { message, mode: CHAT_MODE }) as AxiosResponse<{ _id: string, althenaUserId: string, title: string, messages: Message, mode: string, isPinned: boolean, chatId: string, lastUpdated: string }>;
      if (response.data.chatId) {
        setChats((prev) => {
          return {
            ...prev,
            messages: [ ...prev.messages, response.data.messages ]
          }
        })
      }
    } catch (error) {
      const err = error as AxiosError<{error: string}>
      toast.error(err.response.data.error);
    } finally {
      setIsLoading(false);
    }
  }

  // console.log(currentChatId, 'checking the chatId 42 --->');

  const sendMessage = async (content: string) => {
    if (isLoading) return;
    
    const requestBody = {
      org_id: ORG_ID,
      org_user_id: userId,
      message: content,
      mode: CHAT_MODE
    }
    if (startContinueChat) {
      setChats((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, { _id: Date.now().toString(),content, mode: CHAT_MODE, role: 'user', timestamp: new Date() }]
        }
      })
      continueChatApi(content);
      return;
    }

    setChats({ 
      _id: '1', title: 'New Title', createdAt: new Date(), 
      messages: [ 
        { _id: '1', content, mode: CHAT_MODE, role: 'user', timestamp: new Date() } 
      ]} 
    )
    setCurrentChatId("1")

    try {
      setIsLoading(true)
      const response = await _post('/chat/new', requestBody)  as AxiosResponse<{ _id: string, althenaUserId: string, title: string, messages: Message[], mode: string, isPinned: boolean, chatId: string, lastUpdated: string }>
      if (response.data.chatId) {
        setCurrentChatId(response.data.chatId);
        setChats({
          _id: response.data._id,
          title: response.data.title,
          createdAt:new Date( moment(response.data.lastUpdated).toISOString()),
          messages: response.data.messages,
        })
        setStartContinueChat(true);
        updateTrackNewChat(false);
      }
    } catch (error) {
      const err = error as AxiosError<{error: string}>
      toast.error(err.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnotherChat = async (chatId: string) => {
    setCurrentChatId(chatId)
    console.log("Iam coming insdie the selctanotherchat function 114 -->")
    try {
      const response = await _post('/chat/messages',{ chatId }) as AxiosResponse<{ _id: string, althenaUserId: string, title: string, messages: Message[], mode: string, isPinned: boolean, chatId: string, lastUpdates: string }>
      if (response.data.chatId) {
        const { _id, lastUpdates, messages, title } = response.data;
        setChats({ _id, title, createdAt: new Date(lastUpdates), messages })
        setStartContinueChat(true);
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      toast.error(err.response.data.error)
    }
  }

  const changeChatIdWhenNewChat = (chatId: string) => {
    setCurrentChatId(chatId);
  }

  const resetChatWhenAddOrDelete = () => {
    setChats(INITIAL_STATE)
  }

  const updateTrackNewChat = (value: boolean) => {
    setTrackNewChat(value)
  }

  const deleteChat = async (chatId: string) => {
    console.log(chatId, 'checking the chatId 163 --->');
  };

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);



  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
        <ChatSidebar
          chats={chats.messages}
          currentChatId={currentChatId}
          onChatSelect={selectAnotherChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          resetChatWhenAddOrDelete={resetChatWhenAddOrDelete}
          changeChatIdWhenNewChat={changeChatIdWhenNewChat}
          trackNewChat = {trackNewChat}
          setTrackNewChat={updateTrackNewChat}
        />
        <ChatArea
          messages={chats.messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;

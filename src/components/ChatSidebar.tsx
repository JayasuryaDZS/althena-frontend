import { useEffect, useCallback, useState } from 'react';
import { Plus, MessageSquare, Trash2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Chat, ChatHistory, Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { userDetails } from '@/types/login';
import { _post, _put } from '@/api/apiClient';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import moment from 'moment';

const CHAT_MODE = 'affirming';
const ORG_ID = 'ZYLEN';

interface ChatSidebarProps {
  chats: Message[];
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  resetChatWhenAddOrDelete: () => void;
  changeChatIdWhenNewChat: (chatId: string) => void;
  trackNewChat: boolean
  setTrackNewChat: (value: boolean) => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  resetChatWhenAddOrDelete,
  changeChatIdWhenNewChat,
  setTrackNewChat, trackNewChat
}: ChatSidebarProps) {
  const { state } = useSidebar();
  const [ chatHistory, setChatHistory ] = useState<ChatHistory[]>([]);
  const [chatToDelete, setChatToDelete] = useState<ChatHistory | null>(null);
  // const [ trackNewChat, setNewChat ] = useState(false);
  const collapsed = state === "collapsed";
  const authenticatedDetails: userDetails = JSON.parse(localStorage.getItem('isAuthenticated'));
  const userId = authenticatedDetails._id;

  const getAllChats = useCallback( async () => {
    try {
      const response = await _post('/chat/history', { org_id: ORG_ID, org_user_id: userId }) as AxiosResponse<{ chats: ChatHistory[], statusCode: number }>
      if (response.data.chats.length) {
        setChatHistory(response.data.chats);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response.data.message)
    }
  }, [userId])

  const deleteOneChatHistory = async (chatId: string) => {
    if (chatId.length < 5) {
      const newArray = [...chatHistory].filter((date) => date.chatId !== chatId);
      setChatHistory(newArray)
    } else {
      try {
        const response = await _put(`/chat/${chatId}/delete`, { org_id: ORG_ID, org_user_id: userId }) as AxiosResponse<{ chats: ChatHistory[], statusCode: number }>
        if (response.data.chats) {
          setChatHistory(response.data.chats)
          resetChatWhenAddOrDelete();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response.data.message)
      }
    }
  }
  const addNewChat = () => {
    const dummyInitialState = { _id: String(chatHistory.length), title: "new chat", mode: CHAT_MODE, isPinned: false, chatId: String(chatHistory.length), lastUpdated: moment().toString() };
    changeChatIdWhenNewChat(String(chatHistory.length))
    setChatHistory((prev) => ([ dummyInitialState, ...prev ]));
    onNewChat()
    setTrackNewChat(true);
    resetChatWhenAddOrDelete();
  }

  useEffect(() => {
    if (!trackNewChat) {
      getAllChats()
    }
  }, [chats, getAllChats, trackNewChat])
  console.log(chatHistory, 'checking the chats mesages in the conseole 85 -->')

  console.log(currentChatId, 'checking the currentChatId 112 000')
  return (
    <>
      {/* Mobile header with trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <h1 className="text-lg font-semibold">Althene</h1>
          <Button onClick={addNewChat} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Sidebar className={cn("border-r border-gray-200 dark:border-gray-700", collapsed ? "w-0" : "w-64")}>
        <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Althena
            </h1>
            <Button onClick={addNewChat} size="sm" variant="outline" className="hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1 px-2">
            <SidebarMenu>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton
                    onClick={() => onChatSelect(chat.chatId)}
                    className={cn(
                      "w-full justify-start group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                      currentChatId === chat.chatId && "bg-gray-100 dark:bg-gray-800 border-l-2 border-blue-500"
                    )}
                  >
                    <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="truncate flex-1 text-left">
                      {chat.title.length > 10 ? chat.title.slice(0, 20) + "..." : chat.title }
                    </span>
                    {chatHistory.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatToDelete(chat);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog open={!!chatToDelete} onOpenChange={(open) => { if (!open) setChatToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              {chatToDelete ? `Are you sure you want to delete the record with title "${chatToDelete.title}"? This action cannot be undone.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (chatToDelete) {
                  deleteOneChatHistory(chatToDelete.chatId);
                  setChatToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Play, LogOut } from "lucide-react";

const Home = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Get user name
    const name = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "User";
    setUserName(name);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleCreateConvoChat = () => {
    navigate("/chat");
  };

  const handleStartSession = () => {
    // For now, redirect to chat as well - you can customize this later
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Althena
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {userName}!
            </span>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What would you like to do?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose an option to get started with your AI assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Create Convo Chat Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Create Convo Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start a new conversation with AI assistant for general chat and questions
              </p>
              <Button 
                onClick={handleCreateConvoChat}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          {/* Start a Session Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-500">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold">Start a Session</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Begin a focused session for specific tasks or projects with AI assistance
              </p>
              <Button 
                onClick={handleStartSession}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Start Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;

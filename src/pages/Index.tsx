
import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Menu, Plus, MessageSquare, Calendar, Trash2, Edit3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: string;
  updatedAt: string;
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load saved chat sessions from localStorage on component mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('prompt-optimizer-sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (parsed && Array.isArray(parsed)) {
          setChatSessions(parsed);
          // Load the most recent session if available
          if (parsed.length > 0) {
            const mostRecent = parsed[0];
            setCurrentChatId(mostRecent.id);
            setMessages(mostRecent.messages);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved chat sessions:', error);
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      try {
        localStorage.setItem('prompt-optimizer-sessions', JSON.stringify(chatSessions));
      } catch (error) {
        console.error('Failed to save chat sessions:', error);
      }
    }
  }, [chatSessions]);

  // Update current chat session when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const updatedSessions = chatSessions.map(session => 
        session.id === currentChatId 
          ? { 
              ...session, 
              messages, 
              updatedAt: new Date().toISOString(),
              title: session.title === 'New Chat' && messages.length > 0 && messages[0].role === 'user' 
                ? messages[0].content.substring(0, 50) + (messages[0].content.length > 50 ? '...' : '')
                : session.title
            }
          : session
      );
      setChatSessions(updatedSessions);
    }
  }, [messages, currentChatId, chatSessions]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "end" 
        });
      }
    };

    // Add a small delay to ensure the DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isOptimizing]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSessions = [newChat, ...chatSessions];
    setChatSessions(updatedSessions);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const loadChat = (chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId);
    if (session) {
      setCurrentChatId(chatId);
      setMessages(session.messages);
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== chatId);
    setChatSessions(updatedSessions);
    
    if (currentChatId === chatId) {
      if (updatedSessions.length > 0) {
        loadChat(updatedSessions[0].id);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    const updatedSessions = chatSessions.map(session =>
      session.id === chatId ? { ...session, title: newTitle } : session
    );
    setChatSessions(updatedSessions);
    setIsEditingTitle(null);
  };

  const clearAllChats = () => {
    setChatSessions([]);
    setCurrentChatId(null);
    setMessages([]);
    try {
      localStorage.removeItem('prompt-optimizer-sessions');
    } catch (error) {
      console.error('Failed to clear chat sessions:', error);
    }
  };

  const exportChatHistory = () => {
    if (messages.length === 0) return;
    
    try {
      const chatData = {
        timestamp: new Date().toISOString(),
        totalMessages: messages.length,
        conversation: messages
      };
      
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-optimizer-chat-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export chat history:', error);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) return;

    // Create new chat if no current chat exists
    if (!currentChatId) {
      createNewChat();
    }

    setIsOptimizing(true);
    const userMessage = { role: "user" as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);

    try {
      // For now, let's use a mock optimization to test the UI
      // TODO: Replace with actual Supabase function call when API key is configured
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock optimization logic
      const optimizedPrompt = `Here's an optimized version of your prompt:

"${prompt}"

**Enhanced with:**
- Clear structure and formatting
- Specific instructions and context
- Professional tone and clarity
- Actionable guidance for better results

This is a temporary mock response. To enable real AI optimization, you'll need to:
1. Get an AIMLAPI key from https://aimlapi.com
2. Set it as an environment variable in your Supabase project
3. Deploy the Edge Function`;

      const assistantMessage = { role: "assistant" as const, content: optimizedPrompt };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Optimization error:', error);
      const errorMessage = { 
        role: "assistant" as const, 
        content: "I'm sorry, I couldn't optimize your prompt right now. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsOptimizing(false);
      setPrompt("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const ChatHistory = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
        <p className="text-sm text-muted-foreground">Your conversation history</p>
      </div>

      <Separator />

      {/* Chat Sessions List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 p-2">
          {chatSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Start a conversation to see your history</p>
            </div>
          ) : (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === session.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => loadChat(session.id)}
              >
                {isEditingTitle === session.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => updateChatTitle(session.id, editTitle)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateChatTitle(session.id, editTitle);
                      } else if (e.key === 'Escape') {
                        setIsEditingTitle(null);
                      }
                    }}
                    className="h-6 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {session.messages.length} msgs
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Menu className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingTitle(session.id);
                            setEditTitle(session.title);
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(session.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Clear All Button */}
      {chatSessions.length > 0 && (
        <>
          <Separator />
          <div className="p-4">
            <Button 
              onClick={clearAllChats} 
              variant="outline" 
              size="sm" 
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Chats
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const SidebarComponent = () => <AppSidebar onNewChat={createNewChat} />;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Navigation Sidebar */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarComponent />
            </SheetContent>
          </Sheet>
        ) : (
          <SidebarComponent />
        )}

        {/* Chat History Sidebar */}
        <div className="w-80 border-r border-border bg-muted/30 hidden md:flex">
          <ChatHistory />
        </div>

        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
            <div className="flex items-center gap-3">
                             {!isMobile && (
                 <img 
                   src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                   alt="Prompt Optimizer Logo" 
                   className="w-8 h-8 rounded-lg object-cover"
                 />
               )}
              <div className="flex flex-col">
                <h1 className={`font-semibold text-foreground ${isMobile ? 'text-lg ml-12' : 'text-xl'}`}>
                  {currentChatId ? 
                    chatSessions.find(s => s.id === currentChatId)?.title || 'AI Prompt Optimizer' 
                    : 'AI Prompt Optimizer'
                  }
                </h1>
                {messages.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Chat History Button */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <ChatHistory />
                  </SheetContent>
                </Sheet>
              )}
              
              {currentChatId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChatHistory}
                  className="text-xs hidden md:flex"
                >
                  Export
                </Button>
              )}
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
              {messages.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                     <img 
                       src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                       alt="Prompt Optimizer Logo" 
                       className="w-12 h-12 object-cover"
                     />
                   </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Welcome to AI Prompt Optimizer
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      Enter your prompt below and I'll help you optimize it for better AI responses.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground border border-border'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isOptimizing && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-muted border border-border">
                        <div className="flex items-center space-x-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">Optimizing your prompt...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col space-y-3">
                  <Textarea
                    placeholder="Enter your prompt here to optimize it..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] resize-none border-border focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleOptimize();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Press Shift + Enter for new line
                    </div>
                    <Button 
                      onClick={handleOptimize} 
                      disabled={!prompt.trim() || isOptimizing}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;

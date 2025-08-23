
import { useState, useEffect, useRef } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Menu, Copy, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";


interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: string;
  updatedAt: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  console.log('Mobile detection:', isMobile); // Debug log
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load saved chat sessions from localStorage on component mount
  useEffect(() => {
    console.log('Index component mounted, loading chat sessions...'); // Debug log
    try {
      const savedSessions = localStorage.getItem('prompt-optimizer-sessions');
      console.log('Saved sessions from localStorage:', savedSessions); // Debug log
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

  // Test if React is working properly
  useEffect(() => {
    console.log('Index component rendered with state:', {
      prompt,
      messages: messages.length,
      isOptimizing,
      chatSessions: chatSessions.length,
      currentChatId,
      isMobile
    });
  });

  const createNewChat = () => {
    console.log('createNewChat called!', { user, loading }); // Debug log
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
    console.log('clearAllChats called!'); // Debug log
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

  const handleCopyPrompt = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const handleOptimize = async () => {
    console.log('handleOptimize called!', { prompt, user, loading }); // Debug log
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



  const SidebarComponent = () => (
    <AppSidebar 
      onNewChat={createNewChat}
      chatSessions={chatSessions}
      currentChatId={currentChatId}
      onLoadChat={loadChat}
      onDeleteChat={deleteChat}
      onUpdateChatTitle={updateChatTitle}
      onClearAllChats={clearAllChats}
      onExportChatHistory={exportChatHistory}
    />
  );

  return (
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



      <div className="flex-1 flex flex-col">
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
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* Debug Info - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-4 right-4 z-10 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs max-w-xs">
                <div className="font-semibold mb-1">🔧 Development Mode</div>
                <div>Auth Status: {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}</div>
                <div>User: {user ? user.email : 'None'}</div>
                <div className="mt-1 text-xs text-gray-600">
                  Buttons should work now in dev mode
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 text-xs"
                  onClick={() => {
                    console.log('Testing Supabase connection...');
                    import('@/integrations/supabase/client').then(({ supabase }) => {
                      console.log('Supabase client:', supabase);
                      supabase.auth.getSession().then(({ data, error }) => {
                        console.log('Supabase session test:', { data, error });
                      });
                    });
                  }}
                >
                  Test Supabase
                </Button>
              </div>
            )}
            
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>
                        {/* Chat Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                      alt="Prompt Optimizer Logo" 
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  <div className="space-y-3 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                      {chatSessions.length > 0 ? 'Welcome back!' : 'Welcome to AI Prompt Optimizer'}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {chatSessions.length > 0 
                        ? `You have ${chatSessions.length} previous chat${chatSessions.length !== 1 ? 's' : ''}. Select one from the sidebar or start a new conversation below.`
                        : 'Enter your prompt below and I\'ll help you optimize it for better AI responses.'
                      }
                </p>
              </div>

                  {/* Show recent chats preview */}
                  {chatSessions.length > 0 && (
                    <div className="w-full max-w-4xl mt-8">
                      <h3 className="text-xl font-semibold mb-4 text-foreground">Recent Chats</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chatSessions.slice(0, 6).map((session) => (
                          <div
                            key={session.id}
                            onClick={() => loadChat(session.id)}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 bg-muted/30 hover:bg-muted/50"
                          >
                            <h4 className="font-medium text-foreground truncate mb-2">
                              {session.title}
                            </h4>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{session.messages.length} message{session.messages.length !== 1 ? 's' : ''}</span>
                              <span>{formatDate(session.updatedAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full space-y-6 px-4 md:px-8">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-4 md:p-6 rounded-2xl relative group ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground border border-border'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        
                        {/* Copy Button - Only show for assistant messages (optimized prompts) */}
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyPrompt(message.content, `msg-${index}`)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                          >
                            {copiedMessageId === `msg-${index}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isOptimizing && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-4 md:p-6 rounded-2xl bg-muted border border-border">
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
            <div className="border-t border-border p-4 md:p-8 relative z-10">
              <div className="w-full px-4 md:px-8">
                <div className="flex flex-col space-y-3">
                <Textarea
                    placeholder="Enter your prompt here to optimize it..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[140px] md:min-h-[160px] resize-none border-border focus:ring-2 focus:ring-primary/20 w-full text-lg"
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
                  onClick={(e) => {
                    console.log('Button clicked!', e);
                    try {
                      handleOptimize();
                    } catch (error) {
                      console.error('Error in handleOptimize:', error);
                    }
                  }}
                  disabled={!prompt.trim() || isOptimizing}
                  className="flex items-center gap-2 relative z-20"
                >
                  <Send className="w-4 h-4" />
                  {isOptimizing ? 'Optimizing...' : 'Optimize'}
                </Button>
                
                {/* Test button to see if Button component works */}
                <button 
                  onClick={() => console.log('Native button clicked!')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Test Native Button
                </button>
              </div>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="text-center py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                AI Prompt Optimizer can make mistakes. Always review and verify important information.
              </p>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Index;

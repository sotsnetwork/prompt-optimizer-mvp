
import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('prompt-optimizer-chats');
      if (savedChats) {
        const parsed = JSON.parse(savedChats);
        if (parsed && Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load saved chats:', error);
    }
  }, []);

  // Save chats to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('prompt-optimizer-chats', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chats:', error);
      }
    }
  }, [messages]);

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

  const clearChatHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem('prompt-optimizer-chats');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
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

  const SidebarComponent = () => <AppSidebar />;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Mobile Sidebar */}
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
                  AI Prompt Optimizer
                </h1>
                {messages.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportChatHistory}
                    className="text-xs"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChatHistory}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </>
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

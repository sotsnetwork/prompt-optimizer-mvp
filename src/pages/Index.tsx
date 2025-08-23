
import { useState } from "react";
import { Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [rawPrompt, setRawPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const handleOptimize = async () => {
    if (!rawPrompt.trim()) {
      toast.error("Please enter a prompt to optimize");
      return;
    }

    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-prompt', {
        body: { prompt: rawPrompt }
      });

      if (error) {
        console.error('Error calling optimize function:', error);
        toast.error("Failed to optimize prompt. Please try again.");
        return;
      }

      if (data?.optimizedPrompt) {
        setOptimizedPrompt(data.optimizedPrompt);
        toast.success("Prompt optimized successfully!");
      } else {
        toast.error("No optimized prompt received. Please try again.");
      }
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      toast.error("Failed to optimize prompt. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopyOptimized = async () => {
    if (!optimizedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopiedOptimized(true);
      toast.success("Optimized prompt copied to clipboard!");
      
      setTimeout(() => {
        setCopiedOptimized(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOptimize();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6 bg-background">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <img 
                src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                alt="Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-lg font-semibold text-foreground">Prompt Optimizer</h1>
            </div>
            <ThemeToggle />
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-background">
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
              {/* Chat Area */}
              <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
                {!optimizedPrompt ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                        alt="Logo" 
                        className="w-6 h-6"
                      />
                    </div>
                    <h2 className="text-2xl font-medium text-foreground">
                      How can I optimize your prompt today?
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                      Paste your prompt below and I'll help you make it more effective and precise.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* User Input */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl p-4">
                          <p className="text-foreground whitespace-pre-wrap">{rawPrompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                        <img 
                          src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                          alt="AI" 
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="space-y-3">
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{optimizedPrompt}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleCopyOptimized}
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedOptimized ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              {copiedOptimized ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4 bg-background">
                <div className="relative max-w-3xl mx-auto">
                  <div className="relative flex items-end gap-3 bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <Textarea
                      placeholder="Message Prompt Optimizer..."
                      value={rawPrompt}
                      onChange={(e) => setRawPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0 text-foreground placeholder:text-muted-foreground"
                      style={{ boxShadow: 'none' }}
                    />
                    <Button
                      onClick={handleOptimize}
                      disabled={isOptimizing || !rawPrompt.trim()}
                      size="sm"
                      className="m-2 h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      {isOptimizing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Prompt Optimizer can make mistakes. Check important info.
                  </p>
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

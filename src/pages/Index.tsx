
import { useState } from "react";
import { Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Prompt Optimizer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Area */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {!optimizedPrompt ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <img 
                  src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                  alt="Logo" 
                  className="w-16 h-16 opacity-20"
                />
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                  How can I optimize your prompt today?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Paste your prompt below and I'll help you make it more effective and precise.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Input */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{rawPrompt}</p>
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-4">
                  <img 
                    src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                    alt="AI" 
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{optimizedPrompt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCopyOptimized}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative flex items-end gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Textarea
                  placeholder="Message Prompt Optimizer..."
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  style={{ boxShadow: 'none' }}
                />
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing || !rawPrompt.trim()}
                  size="sm"
                  className="m-2 h-8 w-8 p-0 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                Prompt Optimizer can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

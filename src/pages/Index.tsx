
import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PromptCard } from "@/components/PromptCard";
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

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6">
            <h1 className="text-xl font-semibold text-foreground">Prompt Optimizer</h1>
            <ThemeToggle />
          </header>

          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">AI Prompt Optimizer</h1>
                <p className="text-muted-foreground">
                  Transform your prompts into more effective, precise instructions for better AI results
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your raw prompt here..."
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                
                <Button 
                  onClick={handleOptimize}
                  disabled={isOptimizing || !rawPrompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isOptimizing ? "Optimizing..." : "Optimize Prompt"}
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <PromptCard
                  title="Raw Prompt"
                  content={rawPrompt || "Your original prompt will appear here..."}
                />
                <div className="relative">
                  <PromptCard
                    title="Optimized Prompt"
                    content={optimizedPrompt || "Your optimized prompt will appear here..."}
                  />
                  {optimizedPrompt && (
                    <Button
                      onClick={handleCopyOptimized}
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      {copiedOptimized ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
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

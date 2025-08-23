
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
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-semibold text-foreground">Prompt Optimizer</h1>
            </div>
            <ThemeToggle />
          </header>

          
          <main className="flex-1 overflow-auto p-8 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>
            
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Prompt Optimizer
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Transform your prompts into more effective, precise instructions for better AI results
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Textarea
                    placeholder="Enter your raw prompt here..."
                    value={rawPrompt}
                    onChange={(e) => setRawPrompt(e.target.value)}
                    className="min-h-[300px] resize-none text-lg p-6 border-2 border-border/50 focus:border-primary/50 transition-all duration-200 rounded-xl shadow-sm"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    {rawPrompt.length} characters
                  </div>
                </div>
                
                <Button 
                  onClick={handleOptimize}
                  disabled={isOptimizing || !rawPrompt.trim()}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Sparkles className="mr-3 h-6 w-6" />
                  {isOptimizing ? "Optimizing..." : "Optimize Prompt"}
                </Button>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-card border-2 border-border/50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Raw Prompt
                  </h3>
                  <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg text-muted-foreground">
                    {rawPrompt || "Your original prompt will appear here..."}
                  </div>
                </div>
                
                <div className="bg-card border-2 border-border/50 rounded-xl p-6 shadow-sm relative">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Optimized Prompt
                  </h3>
                  <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg text-muted-foreground">
                    {optimizedPrompt || "Your optimized prompt will appear here..."}
                  </div>
                  {optimizedPrompt && (
                    <Button
                      onClick={handleCopyOptimized}
                      variant="outline"
                      size="sm"
                      className="absolute top-6 right-6"
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

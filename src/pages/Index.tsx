
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PromptCard } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const [rawPrompt, setRawPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!rawPrompt.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate API call with mock optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOptimized = `Enhanced version: ${rawPrompt}\n\nKey improvements:\n- Added specific context\n- Clarified desired output format\n- Included relevant constraints\n- Enhanced clarity and precision`;
    
    setOptimizedPrompt(mockOptimized);
    setIsOptimizing(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="btn-ghost" />
                <h1 className="text-xl font-semibold app-text-primary">Prompt Optimizer</h1>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="card-primary">
                <h2 className="text-lg font-semibold app-text-primary mb-4">
                  Enter Your Prompt
                </h2>
                <Textarea
                  placeholder="Enter your raw prompt here..."
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  className="input-primary min-h-[120px] resize-none"
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleOptimize}
                    disabled={!rawPrompt.trim() || isOptimizing}
                    className="btn-primary"
                  >
                    {isOptimizing ? "Optimizing..." : "Optimize Prompt"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <PromptCard 
                title="Raw Prompt" 
                content={rawPrompt} 
              />
              <PromptCard 
                title="Optimized Prompt" 
                content={optimizedPrompt}
                isLoading={isOptimizing}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

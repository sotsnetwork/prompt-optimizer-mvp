import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Users, 
  Zap, 
  Target, 
  BarChart3,
  Play,
  Save,
  Share2,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

interface PromptBenchmark {
  id: string;
  prompt: string;
  model: string;
  category: string;
  metrics: {
    clarity: number;
    effectiveness: number;
    creativity: number;
    consistency: number;
    overall: number;
  };
  votes: number;
  comments: number;
  author: string;
  timestamp: string;
  tags: string[];
}

const mockBenchmarks: PromptBenchmark[] = [];

const models = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3", name: "Claude-3", provider: "Anthropic" },
  { id: "claude-2", name: "Claude-2", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "llama-2", name: "Llama 2", provider: "Meta" },
  { id: "mistral", name: "Mistral", provider: "Mistral AI" }
];

const categories = [
  "All Categories",
  "Prompt Engineering",
  "Creative Writing",
  "Data Science",
  "Business",
  "Education",
  "Healthcare",
  "Technology",
  "Marketing",
  "Research"
];

export default function Benchmarks() {
  const [benchmarks, setBenchmarks] = useState<PromptBenchmark[]>(mockBenchmarks);
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortBy, setSortBy] = useState<string>("overall");
  const [newPrompt, setNewPrompt] = useState("");
  const [selectedModelForTest, setSelectedModelForTest] = useState<string>("gpt-4");
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const filteredBenchmarks = benchmarks
    .filter(b => selectedModel === "all" || b.model.toLowerCase().includes(selectedModel.toLowerCase()))
    .filter(b => selectedCategory === "All Categories" || b.category === selectedCategory)
    .sort((a, b) => b.metrics[sortBy as keyof typeof a.metrics] - a.metrics[sortBy as keyof typeof a.metrics]);

  const handleTestPrompt = async () => {
    if (!newPrompt.trim()) return;
    
    setIsTesting(true);
    // Simulate API call to test prompt
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResults({
      prompt: newPrompt,
      model: selectedModelForTest,
      metrics: {
        clarity: Math.floor(Math.random() * 20) + 80,
        effectiveness: Math.floor(Math.random() * 20) + 80,
        creativity: Math.floor(Math.random() * 20) + 80,
        consistency: Math.floor(Math.random() * 20) + 80,
        overall: Math.floor(Math.random() * 20) + 80
      }
    });
    setIsTesting(false);
  };

  const handleVote = (benchmarkId: string) => {
    setBenchmarks(prev => prev.map(b => 
      b.id === benchmarkId ? { ...b, votes: b.votes + 1 } : b
    ));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-semibold text-foreground">Prompt Benchmarks</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  The Hugging Face of Prompts
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Benchmark, evaluate, and discover the most successful prompts across different AI models. 
                  Join the community in building the ultimate prompt library.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>1,247 prompts tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>7 AI models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>89% success rate</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="leaderboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                  <TabsTrigger value="test">Test Your Prompt</TabsTrigger>
                  <TabsTrigger value="submit">Submit Prompt</TabsTrigger>
                </TabsList>

                <TabsContent value="leaderboard" className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Models</SelectItem>
                          {models.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overall">Overall Score</SelectItem>
                          <SelectItem value="clarity">Clarity</SelectItem>
                          <SelectItem value="effectiveness">Effectiveness</SelectItem>
                          <SelectItem value="creativity">Creativity</SelectItem>
                          <SelectItem value="consistency">Consistency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {filteredBenchmarks.length} prompts found
                    </div>
                  </div>

                  {/* Leaderboard */}
                  {filteredBenchmarks.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <BarChart3 className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">No Benchmarks Yet</h3>
                        <p className="text-muted-foreground">
                          Be the first to submit a prompt for benchmarking!
                        </p>
                      </div>
                      <Button className="mt-4">
                        Submit Your First Prompt
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBenchmarks.map((benchmark, index) => (
                      <Card key={benchmark.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {benchmark.prompt.length > 100 
                                      ? benchmark.prompt.substring(0, 100) + "..." 
                                      : benchmark.prompt
                                    }
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary">{benchmark.model}</Badge>
                                    <Badge variant="outline">{benchmark.category}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      by {benchmark.author}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-5 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {benchmark.metrics.clarity}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Clarity</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">
                                    {benchmark.metrics.effectiveness}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Effectiveness</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {benchmark.metrics.creativity}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Creativity</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">
                                    {benchmark.metrics.consistency}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Consistency</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-yellow-600">
                                    {benchmark.metrics.overall}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Overall</div>
                                </div>
                              </div>

                              {/* Overall Score Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Overall Score</span>
                                  <span className="font-semibold">{benchmark.metrics.overall}/100</span>
                                </div>
                                <Progress value={benchmark.metrics.overall} className="h-2" />
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 ml-6">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-foreground">
                                  {benchmark.votes}
                                </div>
                                <div className="text-xs text-muted-foreground">votes</div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVote(benchmark.id)}
                                  className="flex items-center gap-2"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  Vote
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                  {benchmark.comments}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="test" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Your Prompt</CardTitle>
                      <CardDescription>
                        Test how well your prompt performs across different AI models and get detailed metrics.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="prompt">Your Prompt</Label>
                          <Textarea
                            id="prompt"
                            placeholder="Enter the prompt you want to test..."
                            value={newPrompt}
                            onChange={(e) => setNewPrompt(e.target.value)}
                            className="min-h-[120px] mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="model">AI Model</Label>
                          <Select value={selectedModelForTest} onValueChange={setSelectedModelForTest}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                            <SelectContent>
                              {models.map(model => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name} ({model.provider})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button 
                          onClick={handleTestPrompt} 
                          disabled={!newPrompt.trim() || isTesting}
                          className="w-full"
                        >
                          {isTesting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Testing Prompt...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Test Prompt
                            </>
                          )}
                        </Button>
                      </div>

                      {testResults && (
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                          <div className="grid grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {testResults.metrics.clarity}
                              </div>
                              <div className="text-xs text-muted-foreground">Clarity</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {testResults.metrics.effectiveness}
                              </div>
                              <div className="text-xs text-muted-foreground">Effectiveness</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {testResults.metrics.creativity}
                              </div>
                              <div className="text-xs text-muted-foreground">Creativity</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {testResults.metrics.consistency}
                              </div>
                              <div className="text-xs text-muted-foreground">Consistency</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">
                                {testResults.metrics.overall}
                              </div>
                              <div className="text-xs text-muted-foreground">Overall</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Overall Score</span>
                              <span className="font-semibold">{testResults.metrics.overall}/100</span>
                            </div>
                            <Progress value={testResults.metrics.overall} className="h-2" />
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" className="flex-1">
                              <Save className="h-4 w-4 mr-2" />
                              Save Results
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="submit" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Your Prompt</CardTitle>
                      <CardDescription>
                        Share your best prompts with the community and help others discover effective AI interactions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="submit-prompt">Prompt</Label>
                          <Textarea
                            id="submit-prompt"
                            placeholder="Enter your prompt here..."
                            className="min-h-[120px] mt-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.slice(1).map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                              id="tags"
                              placeholder="e.g., prompt-engineering, optimization"
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Explain what this prompt does and why it's effective..."
                            className="mt-2"
                          />
                        </div>

                        <Button className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Submit Prompt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
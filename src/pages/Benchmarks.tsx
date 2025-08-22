import { BarChart3, TrendingUp, Clock, Target, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const benchmarkData = [
  {
    category: "Code Generation",
    tests: 150,
    avgImprovement: 34.2,
    bestScore: 95.8,
    trend: "up",
    description: "Performance on code generation and programming tasks"
  },
  {
    category: "Creative Writing",
    tests: 89,
    avgImprovement: 28.7,
    bestScore: 92.1,
    trend: "up",
    description: "Quality improvement in creative content generation"
  },
  {
    category: "Data Analysis",
    tests: 67,
    avgImprovement: 41.5,
    bestScore: 97.2,
    trend: "up",
    description: "Accuracy in data interpretation and analysis tasks"
  },
  {
    category: "Problem Solving",
    tests: 112,
    avgImprovement: 22.8,
    bestScore: 88.9,
    trend: "stable",
    description: "Logical reasoning and problem-solving capabilities"
  },
  {
    category: "Language Translation",
    tests: 203,
    avgImprovement: 18.3,
    bestScore: 94.6,
    trend: "up",
    description: "Quality of multilingual content translation"
  }
];

const recentTests = [
  { name: "GPT-4 Coding Benchmark", score: 87.3, category: "Code Generation", date: "2 hours ago" },
  { name: "Creative Writing Assessment", score: 91.7, category: "Creative Writing", date: "5 hours ago" },
  { name: "Data Analysis Challenge", score: 94.2, category: "Data Analysis", date: "1 day ago" },
  { name: "Logic Reasoning Test", score: 82.1, category: "Problem Solving", date: "1 day ago" },
  { name: "Translation Quality Check", score: 89.5, category: "Language Translation", date: "2 days ago" }
];

export default function Benchmarks() {
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
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Performance Benchmarks</h1>
                <p className="text-muted-foreground">
                  Track optimization performance across different AI task categories
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">621</div>
                    <p className="text-xs text-muted-foreground">+23 this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">29.1%</div>
                    <p className="text-xs text-muted-foreground">+2.3% this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">97.2</div>
                    <p className="text-xs text-muted-foreground">Data Analysis</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Test Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.3s</div>
                    <p className="text-xs text-muted-foreground">avg response</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Benchmark Categories</CardTitle>
                    <CardDescription>
                      Performance metrics across different AI task categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {benchmarkData.map((benchmark, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{benchmark.category}</h3>
                                <Badge variant="secondary">{benchmark.tests} tests</Badge>
                                <Badge 
                                  variant={benchmark.trend === "up" ? "default" : "secondary"}
                                  className={benchmark.trend === "up" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                                >
                                  {benchmark.trend === "up" ? "↗" : "→"} {benchmark.avgImprovement}%
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {benchmark.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{benchmark.bestScore}</p>
                              <p className="text-xs text-muted-foreground">best score</p>
                            </div>
                          </div>
                          <Progress value={benchmark.bestScore} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Test Results</CardTitle>
                    <CardDescription>
                      Latest benchmark test results and performance scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTests.map((test, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{test.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{test.category}</Badge>
                              <span className="text-sm text-muted-foreground">{test.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">{test.score}</p>
                            <p className="text-xs text-muted-foreground">score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
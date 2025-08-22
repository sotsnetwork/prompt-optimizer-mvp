import { BarChart3, TrendingUp, Clock, Target, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

// Empty benchmark data - will be populated with real test results
const benchmarkData: any[] = [];

const recentTests: any[] = [];

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
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No tests yet</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">No scores yet</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Test Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">No data yet</p>
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
                    {benchmarkData.length === 0 ? (
                      <div className="text-center py-12">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No benchmark data yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Benchmark results will appear here as users test prompt optimizations across different categories.
                        </p>
                      </div>
                    ) : (
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
                    )}
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
                    {recentTests.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No recent tests</h3>
                        <p className="text-sm text-muted-foreground">
                          Test results will appear here as users run benchmark evaluations.
                        </p>
                      </div>
                    ) : (
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
                    )}
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
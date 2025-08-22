import { Trophy, Medal, Crown, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

// Empty leaderboard data - will be populated with real user signups
const leaderboardData: any[] = [];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <Trophy className="h-6 w-6 text-muted-foreground" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Expert":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Advanced":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Intermediate":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function Leaderboard() {
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
                <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
                <p className="text-muted-foreground">
                  Top prompt optimizers ranked by performance and contributions
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No users yet</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No optimizations yet</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">No scores yet</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    Ranked by optimization score and community contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leaderboardData.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No users yet</h3>
                      <p className="text-sm text-muted-foreground">
                        The leaderboard will populate as users sign up and start optimizing prompts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leaderboardData.map((user) => (
                        <div
                          key={user.rank}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getRankIcon(user.rank)}
                              <span className="font-semibold text-lg">#{user.rank}</span>
                            </div>
                            <Avatar>
                              <AvatarFallback>
                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.optimizations} optimizations
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getLevelColor(user.level)}>
                              {user.level}
                            </Badge>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{user.score}</p>
                              <p className="text-sm text-muted-foreground">score</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
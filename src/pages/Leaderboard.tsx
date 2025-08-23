import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Zap, 
  Target,
  Award,
  Flame,
  Rocket,
  Gem
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  points: number;
  level: string;
  badges: string[];
  stats: {
    promptsSubmitted: number;
    promptsVoted: number;
    totalVotes: number;
    averageScore: number;
    streak: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

const mockLeaderboard: LeaderboardUser[] = [];

const achievements = [
  { id: "1", name: "First Steps", description: "Submit your first prompt", icon: "👣", points: 10, unlocked: true },
  { id: "2", name: "Voter", description: "Vote on 10 prompts", icon: "🗳️", points: 25, unlocked: true },
  { id: "3", name: "Contributor", description: "Submit 10 prompts", icon: "📝", points: 50, unlocked: true },
  { id: "4", name: "Popular", description: "Receive 100 votes", icon: "⭐", points: 100, unlocked: false },
  { id: "5", name: "Streak Master", description: "Maintain 30-day streak", icon: "🔥", points: 200, unlocked: false },
  { id: "6", name: "Grandmaster", description: "Reach 2500+ points", icon: "👑", points: 500, unlocked: false }
];

const levels = [
  { name: "Novice", minPoints: 0, maxPoints: 99, color: "text-gray-500" },
  { name: "Beginner", minPoints: 100, maxPoints: 299, color: "text-green-500" },
  { name: "Intermediate", minPoints: 300, maxPoints: 699, color: "text-blue-500" },
  { name: "Advanced", minPoints: 700, maxPoints: 1499, color: "text-purple-500" },
  { name: "Expert", minPoints: 1500, maxPoints: 2499, color: "text-orange-500" },
  { name: "Master", minPoints: 2500, maxPoints: 3999, color: "text-red-500" },
  { name: "Grandmaster", minPoints: 4000, maxPoints: 999999, color: "text-yellow-500" }
];

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState("global");
  const [timeframe, setTimeframe] = useState("all-time");

  const getLevelInfo = (points: number) => {
    return levels.find(level => points >= level.minPoints && points <= level.maxPoints) || levels[0];
  };

  const getNextLevel = (points: number) => {
    const currentLevel = getLevelInfo(points);
    const nextLevel = levels.find(level => level.minPoints > points);
    return nextLevel;
  };

  const getProgressToNextLevel = (points: number) => {
    const currentLevel = getLevelInfo(points);
    const nextLevel = getNextLevel(points);
    if (!nextLevel) return 100;
    
    const progress = ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-semibold text-foreground">Leaderboard</h1>
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
                  Community Champions
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Compete with the best prompt engineers, earn achievements, and climb the ranks 
                  in the ultimate prompt optimization community.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>2,847 active users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>47,892 prompts tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>89% success rate</span>
                  </div>
                </div>
              </div>

              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="global">Global Rankings</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="competitions">Competitions</TabsTrigger>
                </TabsList>

                <TabsContent value="global" className="space-y-6">
                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Second Place */}
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-b from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-4xl">
                          🥈
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">CreativeCoach</h3>
                        <p className="text-sm text-muted-foreground">2,653 points</p>
                        <Badge variant="secondary" className="mt-2">Master</Badge>
                      </div>
                    </div>

                    {/* First Place */}
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-5xl">
                          👑
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">PromptMaster</h3>
                        <p className="text-sm text-muted-foreground">2,847 points</p>
                        <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500">Grandmaster</Badge>
                      </div>
                    </div>

                    {/* Third Place */}
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-b from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-4xl">
                          🥉
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">DataWizard</h3>
                        <p className="text-sm text-muted-foreground">2,489 points</p>
                        <Badge variant="secondary" className="mt-2">Expert</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Full Leaderboard */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Global Rankings
                      </CardTitle>
                      <CardDescription>
                        Top prompt engineers ranked by points, achievements, and community contribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mockLeaderboard.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">No Rankings Yet</h3>
                            <p className="text-sm text-muted-foreground">
                              Be the first to submit prompts and climb the leaderboard!
                            </p>
                          </div>
                          <Button className="mt-4">
                            Submit Your First Prompt
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mockLeaderboard.map((user, index) => (
                          <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                            {/* Rank */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg">
                              {user.rank}
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground">{user.username}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{user.level}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {user.stats.promptsSubmitted} prompts • {user.stats.totalVotes} votes
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="flex gap-1">
                              {user.badges.map((badge, badgeIndex) => (
                                <span key={badgeIndex} className="text-2xl">{badge}</span>
                              ))}
                            </div>

                            {/* Stats */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-foreground">
                                {user.points.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">points</div>
                            </div>

                            {/* Actions */}
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Available Achievements */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Available Achievements
                        </CardTitle>
                        <CardDescription>
                          Complete challenges to earn points and unlock badges
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {achievements.map((achievement) => (
                            <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                              <div className="text-3xl">{achievement.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-foreground">
                                  +{achievement.points} pts
                                </div>
                                <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                                  {achievement.unlocked ? "Unlocked" : "Locked"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Your Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Your Progress
                        </CardTitle>
                        <CardDescription>
                          Track your journey to becoming a prompt engineering master
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Current Level */}
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                            🚀
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Beginner</h3>
                            <p className="text-sm text-muted-foreground">0 points</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to Advanced</span>
                            <span>0%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-muted h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Start submitting prompts to earn points!
                          </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-muted-foreground">0</div>
                            <div className="text-xs text-muted-foreground">Prompts</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-muted-foreground">0</div>
                            <div className="text-xs text-muted-foreground">Votes</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-muted-foreground">0</div>
                            <div className="text-xs text-muted-foreground">Streak</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-muted-foreground">0</div>
                            <div className="text-xs text-muted-foreground">Achievements</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="competitions" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Active Competitions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Flame className="h-5 w-5" />
                          Active Competitions
                        </CardTitle>
                        <CardDescription>
                          Join ongoing challenges and compete for prizes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 space-y-4">
                          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <Flame className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">No Active Competitions</h3>
                            <p className="text-sm text-muted-foreground">
                              Check back soon for exciting challenges and competitions!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upcoming Competitions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Upcoming Competitions
                        </CardTitle>
                        <CardDescription>
                          Mark your calendar for future challenges
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 space-y-4">
                          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <Star className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">No Upcoming Competitions</h3>
                            <p className="text-sm text-muted-foreground">
                              We're planning exciting new challenges. Stay tuned!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
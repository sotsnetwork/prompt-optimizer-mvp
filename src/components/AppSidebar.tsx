
import { useState } from "react";
import { Trophy, BarChart3, Settings, Sparkles, Plus, MessageSquare, Calendar, Trash2, Edit3, MoreHorizontal, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const items = [
  { title: "Optimizer", url: "/", icon: Sparkles },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Benchmarks", url: "/benchmarks", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: string;
  updatedAt: string;
}

interface AppSidebarProps {
  onNewChat?: () => void;
  chatSessions?: ChatSession[];
  currentChatId?: string | null;
  onLoadChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onUpdateChatTitle?: (chatId: string, newTitle: string) => void;
  onClearAllChats?: () => void;
  onExportChatHistory?: () => void;
}

export function AppSidebar({ 
  onNewChat, 
  chatSessions = [], 
  currentChatId, 
  onLoadChat, 
  onDeleteChat, 
  onUpdateChatTitle,
  onClearAllChats,
  onExportChatHistory 
}: AppSidebarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    setIsEditingTitle(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (chatId: string) => {
    if (editTitle.trim() && onUpdateChatTitle) {
      onUpdateChatTitle(chatId, editTitle.trim());
    }
    setIsEditingTitle(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(null);
    setEditTitle("");
  };

  // Filter chat sessions based on search query
  const filteredChatSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(message => 
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      {/* Logo and Title */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
            alt="Prompt Optimizer Logo" 
            className="w-8 h-8 object-cover rounded-lg"
          />
          <h1 className="text-lg font-bold text-foreground">Prompt Optimizer</h1>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        {/* New Chat Button */}
        {onNewChat && (
          <Button
            onClick={onNewChat}
            variant="outline"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary hover:text-primary"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">New Chat</span>
          </Button>
        )}
        
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "hover:bg-accent/30 text-foreground/70 hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Chat History Section */}
      {chatSessions.length > 0 && (
        <>
          <Separator className="my-2" />
          <div className="flex-1 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Chats
              </h3>
              {onClearAllChats && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onExportChatHistory && (
                      <DropdownMenuItem onClick={onExportChatHistory}>
                        Export All
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={onClearAllChats}
                      className="text-destructive"
                    >
                      Clear All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {/* Search Input */}
            {chatSessions.length > 3 && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 pl-7 text-xs border-border/50"
                />
              </div>
            )}
            
            <ScrollArea className="flex-1">
              <div className="space-y-1 pb-2">
                {filteredChatSessions.length === 0 && searchQuery ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-xs">No chats found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                ) : (
                  filteredChatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentChatId === session.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/30 text-foreground/70 hover:text-foreground"
                      }`}
                      onClick={() => onLoadChat?.(session.id)}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {isEditingTitle === session.id ? (
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveTitle(session.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTitle(session.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            className="h-6 text-xs border-0 bg-transparent p-0 focus:ring-0"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <div className="text-sm font-medium truncate">{session.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(session.updatedAt)}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTitle(session.id, session.title);
                              }}
                            >
                              <Edit3 className="h-3 w-3 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat?.(session.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}

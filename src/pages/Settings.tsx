
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  theme: "light" | "dark";
  autoSavePrompts: boolean;
  showCharacterCount: boolean;
  analytics: boolean;
  notifications: boolean;
  language: string;
  autoScroll: boolean;
}

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    autoSavePrompts: true,
    showCharacterCount: true,
    analytics: false,
    notifications: true,
    language: "en",
    autoScroll: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        setLastSaved(new Date(parsed.lastSaved || Date.now()));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Update theme when settings change
  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme, setTheme]);

  // Check for unsaved changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const hasChanges = JSON.stringify(parsed) !== JSON.stringify(settings);
        setHasUnsavedChanges(hasChanges);
      } catch (error) {
        setHasUnsavedChanges(true);
      }
    } else {
      setHasUnsavedChanges(true);
    }
  }, [settings]);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const settingsToSave = {
        ...settings,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('app-settings', JSON.stringify(settingsToSave));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      toast({
        title: "Settings saved successfully!",
        description: "Your preferences have been updated.",
        duration: 3000,
      });
      
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings: Settings = {
      theme: "light",
      autoSavePrompts: true,
      showCharacterCount: true,
      analytics: false,
      notifications: true,
      language: "en",
      autoScroll: true,
    };
    
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    
    toast({
      title: "Settings reset",
      description: "Settings have been reset to defaults.",
      duration: 3000,
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-8">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/722b49e2-7cef-4586-9667-7a7af907dd8a.png" 
                alt="Prompt Optimizer Logo" 
                className="w-8 h-8 object-cover rounded-lg"
              />
              <h1 className="text-xl font-semibold text-foreground">Settings</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {/* Save Status Indicator */}
              <div className="flex items-center gap-2 text-sm">
                {hasUnsavedChanges ? (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Unsaved changes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>All changes saved</span>
                  </div>
                )}
              </div>
              
              {/* Save Button */}
              <Button 
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                  <p className="text-muted-foreground mt-2">Manage your application preferences.</p>
                </div>
                
                {lastSaved && (
                  <div className="text-sm text-muted-foreground">
                    Last saved: {lastSaved.toLocaleString()}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Theme</Label>
                        <div className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </div>
                      </div>
                      <Select 
                        value={settings.theme} 
                        onValueChange={(value: "light" | "dark") => handleSettingChange('theme', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Language</Label>
                        <div className="text-sm text-muted-foreground">
                          Choose your preferred language
                        </div>
                      </div>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value: string) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Optimization</CardTitle>
                    <CardDescription>
                      Configure prompt optimization settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-save optimized prompts</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically save successful optimizations to history
                        </div>
                      </div>
                      <Switch 
                        checked={settings.autoSavePrompts}
                        onCheckedChange={(checked) => handleSettingChange('autoSavePrompts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show character count</Label>
                        <div className="text-sm text-muted-foreground">
                          Display character count in prompt input
                        </div>
                      </div>
                      <Switch 
                        checked={settings.showCharacterCount}
                        onCheckedChange={(checked) => handleSettingChange('showCharacterCount', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-scroll to results</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically scroll to show optimization results
                        </div>
                      </div>
                      <Switch 
                        checked={settings.autoScroll}
                        onCheckedChange={(checked) => handleSettingChange('autoScroll', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage your notification preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications about optimization results
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Data</CardTitle>
                    <CardDescription>
                      Manage your data and privacy preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Analytics</Label>
                        <div className="text-sm text-muted-foreground">
                          Help improve the service by sharing usage data
                        </div>
                      </div>
                      <Switch 
                        checked={settings.analytics}
                        onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    Reset to Defaults
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                      <span className="text-sm text-amber-600">
                        You have unsaved changes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;

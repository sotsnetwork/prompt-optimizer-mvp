
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSent(true);
      toast({
        title: 'Success',
        description: 'Password reset email sent! Check your inbox.',
      });
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Check your email and follow the link to reset your password.
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
          >
            Send another email
          </Button>
          <Link to="/signin">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          We'll send you a link to reset your password
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send reset email
      </Button>

      <div className="text-center">
        <Link to="/signin" className="text-sm text-primary hover:underline inline-flex items-center">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
};

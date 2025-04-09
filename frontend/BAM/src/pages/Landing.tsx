import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuth();
  
  // Check authentication status when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img 
              width="30" 
              height="30" 
              src="https://img.icons8.com/ios-filled/50/batman-old.png" 
              alt="batman-logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl">Batman Asset Management</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Login/Register buttons if not authenticated */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link to="/auth/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth/register">Sign up</Link>
                </Button>
              </div>
            ) : (
              /* User dropdown menu if authenticated */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Strategic <span className="text-primary">Wealth Management</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Batman Asset Management (BAM) delivers sophisticated investment solutions, 
            personalized wealth management, and data-driven financial planning.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Batman Asset Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

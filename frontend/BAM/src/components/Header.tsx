import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, LogOut, User } from "lucide-react";

export function Header() {
  const { user, logout, checkAuth } = useAuth();
  
  // Check authentication status when component mounts
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [checkAuth, user]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    return user.username.substring(0, 2).toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to={user ? "/dashboard" : "/"} className="mr-6 flex items-center space-x-2">
            <span className="font-bold">BAM</span>
          </Link>
          
          {/* Only show navigation menu if user is logged in */}
          {user && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground">
                Dashboard
              </Link>
              <Link to="/dashboard/investment-report" className="transition-colors hover:text-foreground/80 text-foreground">
                Investment Report
              </Link>
              <Link to="/dashboard/market-analysis" className="transition-colors hover:text-foreground/80 text-foreground">
                Market Analysis
              </Link>
              <Link to="/dashboard/portfolio" className="transition-colors hover:text-foreground/80 text-foreground">
                BAM AI
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
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
                  <span className="font-medium">{user.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                {user.created_at && (
                  <DropdownMenuItem className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs text-muted-foreground">Member since {formatDate(user.created_at)}</span>
                  </DropdownMenuItem>
                )}
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
  );
}

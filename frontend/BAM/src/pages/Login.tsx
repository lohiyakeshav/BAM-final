import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LoginCredentials } from "@/lib/services/authService";
import { Loader } from "@/components/ui/loader";
import { AlertCircle, ArrowLeft } from "lucide-react";

// Logo component
const BatmanLogo = () => (
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
);

const LoginHeader = () => (
  <div className="text-center">
    <div className="flex justify-center">
      <BatmanLogo />
    </div>
    <h2 className="mt-4 text-2xl font-bold">Sign in to BAM</h2>
    <p className="mt-2 text-muted-foreground">
      Enter your credentials to access your account
    </p>
  </div>
);

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      username?: string;
      password?: string;
    } = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(credentials);
      toast.success("Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            className="absolute top-4 left-4"
            onClick={() => navigate('/landing')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <LoginHeader />
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className={errors.username ? "text-destructive" : ""}>
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={errors.username ? "border-destructive" : ""}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <div className="flex items-center text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                  Password
                </Label>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "border-destructive" : ""}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <div className="flex items-center text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

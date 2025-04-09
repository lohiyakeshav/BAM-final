import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1 h-8", className)}>
      <div className="w-1 h-full bg-primary rounded-full animate-barUp1" />
      <div className="w-1 h-full bg-primary rounded-full animate-barUp2" />
      <div className="w-1 h-full bg-primary rounded-full animate-barUp3" />
      <div className="w-1 h-full bg-primary rounded-full animate-barUp4" />
      <div className="w-1 h-full bg-primary rounded-full animate-barUp5" />
    </div>
  );
} 
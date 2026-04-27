import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      aria-label={label ?? "Loading"}
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "animate-spin rounded-full border-border border-t-primary",
          sizeMap[size],
        )}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  className?: string;
}

export function ErrorState({
  message = "Something went wrong",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      data-ocid="error_state"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center",
        className,
      )}
    >
      <span className="text-destructive font-semibold">{message}</span>
      <span className="text-sm text-muted-foreground">
        Please try refreshing the page.
      </span>
    </div>
  );
}

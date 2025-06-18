import { useCallback } from "react";

export function useToast() {
  // Replace this with your preferred toast library (e.g., sonner, react-hot-toast, etc.)
  const toast = useCallback(({
    title,
    description,
    variant
  }: {
    title: string;
    description?: string;
    variant?: string;
  }) => {
    // For now, just use window.alert for demonstration
    window.alert(`${title}${description ? ": " + description : ""}`);
  }, []);

  return { toast };
} 
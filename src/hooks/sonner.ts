import { useCallback } from "react";
import { toast } from 'sonner'

export function useToast() {
  const showToast = useCallback(
    ({ title, description }: { title: string; description?: string }) => {
      toast(title, {
        description,
      })
    },
    []
  )

  return { toast: showToast }
}

export const showToast = ({ title, description }: { title: string; description?: string }) => {
  toast(title, {
    description,
  })
} 
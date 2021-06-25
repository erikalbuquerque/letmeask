import toast, { Toaster } from 'react-hot-toast'

export function useToast() {
  function handleToastSuccess(title: string) {
    toast.success(title, { position: 'top-right' })
  }
  function handleToastError(title: string) {
    toast.error(title, { position: 'top-right' })
  }
  return { Toaster, handleToastSuccess, handleToastError }
}
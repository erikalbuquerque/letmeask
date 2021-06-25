import toast, { Toaster } from 'react-hot-toast'

export function useToast() {
  function handleToastSuccess(title: string) {
    toast.success(title, { position: 'top-right' })
  }

  function handleToastError(title: string) {
    toast.error(title, { position: 'top-right' })
  }

  function handleToastPromise(promise: Promise<void>) {
    toast.promise(promise, {
      loading: 'Loading',
      success: 'Login success!',
      error: 'Login error please try again!',
    }, {
      position: 'top-right'
    });
  }
  return { Toaster, handleToastSuccess, handleToastError, handleToastPromise }
}
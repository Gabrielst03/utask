import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (<SessionProvider> <ToastContainer theme='dark'></ToastContainer>  <Component {...pageProps} />
  </SessionProvider>)
}

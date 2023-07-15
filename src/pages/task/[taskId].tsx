import { Header } from "@/components/Header";
import { Inter } from "next/font/google";
import { useRouter } from 'next/router'


const inter = Inter({ subsets: ["latin"] });

export default function Task() {

  const router = useRouter()


  return(
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Header />

      <p>Post: {router.query.taskId}</p>





    </main>
  )
}
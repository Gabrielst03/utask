import Image from "next/image";
import { Inter } from "next/font/google";

import {useSession, signIn, signOut} from 'next-auth/react'
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });
import {db} from '../services/firebaseConnection'

export default function Home() {

  const {data: session, status} = useSession()

  return (
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Header />
      <div className="flex flex-col items-center py-16">
        <Image src={"/hero.png"} alt="hero" width={400} height={200} />

        <h1 className="font-bold text-2xl text-center mt-4">
          Sistema Feito para você organizar <br></br> seus estudos e tarefas.
        </h1>

        <div className="flex flex-col gap-2 items-center mt-3">
          <div className="px-3 py-2 rounded-lg bg-green-200 text-sm font-semibold text-green-800">
            Organize Tarefas
          </div>
          <div className="px-3 py-2 rounded-lg bg-amber-200 text-sm font-semibold text-amber-800">
            Aumente sua Produtividade
          </div>
        </div>
      </div>
    </main>
  );
}

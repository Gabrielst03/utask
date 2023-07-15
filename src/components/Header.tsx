import { useSession, signIn, signOut } from "next-auth/react";

import { LogOut } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full h-16 px-6 lg:px-24 py-14 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl md:text-3xl font-bold">
          uTsk<span className="text-amber-600 -ml-0.5 shadow-lg">+</span>
        </Link>
        {session?.user && (
          <Link
            href="/dashboard"
            className="bg-white hidden md:flex px-1 lg:px-3 py-1 md:text-sm rounded text-black"
          >
            Meu Painel
          </Link>
        )}
      </div>
      {status === "loading" ? (
        <></>
      ) : session ? (
        <div className="flex items-center gap-4">
          <h1 className="text-sm md:text-md">
            Olá, <span className="font-bold">{session.user?.name}</span>
          </h1>
          <img
            src={`${session.user?.image}`}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <LogOut
            onClick={() => signOut()}
            className="text-red-500 hover:scale-105 cursor-pointer transition-all"
          />
        </div>
      ) : (
        <a
          onClick={() => signIn("google")}
          className="flex items-center gap-2 px-6 py-2 cursor-pointer rounded-full border hover:bg-red-500 hover:text-white hover:border-transparent transition-colors border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>
          Entrar com Google
        </a>
      )}
    </header>
  );
}

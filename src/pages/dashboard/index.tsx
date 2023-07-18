import { Inter } from "next/font/google";

import { useSession, signIn, signOut } from "next-auth/react";
import { Header } from "@/components/Header";
import { GetServerSideProps } from "next";

import { getSession } from "next-auth/react";
import { ChangeEvent, useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Share2, Trash2 } from "lucide-react";
import Link from "next/link";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  createdAt: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);

  const [tasks, setTasks] = useState<TaskProps[]>([]);

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(`
    http://localhost:3000/task/${id}
    `)

    toast.info('Copiado para Área de Transferência!')
  }


  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");

      const q = query(
        tarefasRef,
        orderBy("createdAt", "desc"),
        where("user", "==", user.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            createdAt: doc.data().createdAt,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(lista);
      });
    }

    loadTarefas();
  }, [user.email]);

  async function newTask() {
    if (input === "") {
      toast.warning("Digite sua tarefa!");
      return;
    }

    try {
      toast.success("Tarefa registrada com sucesso!");

      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        createdAt: new Date(),
        user: user.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);

    } catch (err) {
      toast.error("Ocorreu algum erro ao adicionar esta tarefa.");
      console.log(err);
    }
  }

  async function deleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id)
    await deleteDoc(docRef)
    
    toast.success('Tarefa deletada com sucesso!')
  }

  return (
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Header />

      <div className="flex flex-col gap-1 py-10 px-6 lg:px-48">
        <h1 className="font-semibold text-xl lg:text-3xl">Qual sua tarefa?</h1>
        <textarea
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          className="px-3 py-3 rounded-lg bg-zinc-800 outline-none text-white transition-all"
          placeholder="Digite sua tarefa"
        />
        <div className="flex items-center gap-1 mt-2">
          <input
            type="checkbox"
            checked={publicTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPublicTask(e.target.checked)
            }
            className="b"
          />
          <label htmlFor="" className="">
            Deixar minha tarefa pública.
          </label>
        </div>

        <button
          onClick={newTask}
          className="w-full py-2 rounded-lg bg-amber-500 mt-2 hover:bg-amber-400 font-semibold transition-colors"
        >
          Registrar
        </button>
      </div>
      <div className="flex flex-col min-h-screen bg-zinc-50 w-full px-4 py-4 md:py-12 lg:px-48 items-center">
        <h1 className="text-xl lg:text-3xl text-black font-bold">
          Minhas Tarefas
        </h1>

        <div className="flex flex-col mt-2 md:mt-8 gap-3 w-full">
          {tasks ? tasks.map((item) => (
            <Link
             href={`/task/${item.id}`}
              key={item.id}
              className="flex items-center justify-between w-full py-3 rounded-lg border text-zinc-800 border-gray-300 px-4"
            >
              <div className="flex flex-col">
              <div className={item.public ? 'flex items-center gap-1 mb-3' : 'hidden'}>
              <div className="px-2 py-1 rounded bg-amber-500 w-14 text-xs text-white">Público</div>
              <Share2 className="text-amber-500 w-5 h-5 cursor-pointer" onClick={() => handleShare(item.id)} />
              </div>
            <p>
              {item.tarefa}
            </p>
            </div>
              <button className="px-3 py-1 text-sm rounded bg-red-100 text-red-600" onClick={() => deleteTask(item.id)}>
                <Trash2 className="w-5 h-5"/>
              </button>
            </Link>
          )): (
            <h1>Você não possui tarefas ainda 😢</h1>
          )}

        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: {
        email: session.user.email,
      },
    },
  };
};

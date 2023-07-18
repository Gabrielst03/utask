import { Header } from "@/components/Header";
import { GetServerSideProps } from "next";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

import { db } from "@/services/firebaseConnection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Head from "next/head";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Trash } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

interface TaskProps {
  item: {
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [comments, setComments] = useState(allComments || []);

  async function newComment(e: FormEvent) {
    e.preventDefault();

    if (input === "") {
      toast.warning("Você precisa digitar o comentário");
      return;
    }

    if (!session?.user?.email || !session?.user.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        createdAt: new Date(),
        user: session?.user.email,
        name: session?.user.name,
        taskId: item?.taskId,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user.email,
        name: session?.user.name,
        taskId: item?.taskId,
      };

      setComments((oldItems) => [...oldItems, data]);

      toast.success("Comentário adicionado com sucesso!");
      setInput("");
    } catch {
      toast.error("Algum erro inesperado aconteceu!");
    }
  }

  async function deleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const deleteComment = comments.filter((item) => item.id !== id);

      setComments(deleteComment);
      toast.success("Comentário excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir comentário");
    }
  }

  return (
    <main className={`flex min-h-screen flex-col mb-10 ${inter.className}`}>
      <Head>
        <title>Tarefa - {item.tarefa}</title>
      </Head>
      <Header />

      <div className="flex flex-col gap-2 px-6 lg:px-56 py-20">
        <h1 className="text-3xl font-bold">Tarefa</h1>
        <article className="px-3 py-3 rounded border border-gray-300">
          <p className="w-full whitespace-pre-wrap">{item.tarefa}</p>
        </article>
      </div>

      <section className="flex flex-col w-full gap-1 px-6 lg:px-56">
        <h2>Deixe um comentário</h2>
        <textarea
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          className="px-3 py-3 rounded-lg bg-zinc-800 outline-none text-white transition-all"
          placeholder="Digite seu comentário..."
        />
        <button
          onClick={newComment}
          disabled={!session?.user}
          className="w-full disabled:cursor-not-allowed disabled:opacity-40 mt-3 text-sm bg-amber-500 text-white px-3 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Enviar Comentário
        </button>
      </section>

      <section className="flex flex-col w-full gap-1 px-6 lg:px-56 mt-12">
        <h2 className="text-2xl">Todos os comentários</h2>
        {comments.length === 0 && (
          <span className="text-gray-500 mt-2">
            Nenhum comentário foi encontrado, seja o primeiro a comentar!
          </span>
        )}

        {comments.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-3 py-3 w-full rounded bg-zinc-800"
          >
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full gap-2">
                <p className="text-xs text-white px-2 py-2 rounded bg-zinc-600">
                  {item.name}
                </p>
                {item.user === session?.user?.email && (
                  <Trash
                    className="text-red-500 w-5 h-5 cursor-pointer"
                    onClick={() => deleteComment(item.id)}
                  />
                )}
              </div>
              <p className="mt-2">{item.comment}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tarefas", id);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};

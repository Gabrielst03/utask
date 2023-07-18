import { Header } from "@/components/Header";
import { GetServerSideProps } from "next";
import { Inter } from "next/font/google";
import { useRouter } from 'next/router'

import { db } from "@/services/firebaseConnection";
import {doc, collection, query, where, getDoc} from 'firebase/firestore'
import Head from "next/head";
import { toast } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });


interface TaskProps {
  item: {
    id: string;
    tarefa: string;
    public: boolean;
    createdAt: string;
    user: string;
  }
}

export default function Task({item} : TaskProps) {

  return(
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Head>
        <title>{item.tarefa}</title>
      </Head>
      <Header />

    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, 'tarefas', id);
  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Atribua snapshot.data()?.createdAt?.seconds a uma variável auxiliar
  const createdAtSeconds = snapshot.data()?.createdAt?.seconds;
  const milliseconds = createdAtSeconds ? createdAtSeconds * 1000 : 0;

  // Use uma abordagem clara para obter o valor de public
  const isPublic = snapshot.data()?.['public'];

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: isPublic,
    createdAt: new Date(milliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    id: snapshot.data()?.id,
  };

  return {
    props: {
      item: task,
    },
  };
};
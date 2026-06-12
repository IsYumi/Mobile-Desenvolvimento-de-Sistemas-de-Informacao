import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import boy from "../assets/student_boy.gif";
import girl from "../assets/student_girl.gif";
import "../styles/BoasVindas.css";

import { auth } from "../service/firebaseConfig";
import { getUserProfile } from "../service/firestoreService";

// 1. AVISAMOS AO TYPESCRIPT O QUE VEM DO FIREBASE
interface DadosUsuario {
  id?: string;
  nome?: string;
  genero?: string;
}

export default function BoasVindas() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("Usuário");
  const [genero, setGenero] = useState("masculino");
  const [imagem, setImagem] = useState(boy);

  const selecionarImagem = (generoUsuario: string) => {
    if (generoUsuario === "F") {
      return girl;
    } else if (generoUsuario === "M") {
      return boy;
    } else {
      return Math.random() > 0.5 ? girl : boy;
    }
  };

  useEffect(() => {
    async function buscarDados() {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("Nenhum usuário logado");
        }

        // 2. FORÇAMOS O TYPESCRIPT A ENTENDER O FORMATO DOS DADOS
        const dados = (await getUserProfile(currentUser.uid)) as DadosUsuario;

        setNome(dados.nome || "Usuário");

        if (dados.genero) {
          const imagemSelecionada = selecionarImagem(dados.genero);
          setGenero(dados.genero);
          setImagem(imagemSelecionada);
        }
      } catch (erro) {
        console.error("Erro ao buscar dados do Firebase:", erro);
      }
    }

    buscarDados();

    const timer = setTimeout(() => {
      navigate("/home");
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="boas-container">
      <h1>OLÁ, {(nome || "Usuário").toUpperCase()} !</h1>
      <img src={imagem} alt="estudante" />
    </div>
  );
}

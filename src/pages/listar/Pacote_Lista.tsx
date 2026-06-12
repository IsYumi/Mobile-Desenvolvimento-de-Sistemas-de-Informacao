import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Pacote_Lista.css";
import Navbar from "../../components/Navbar";

// Importações do Firebase e do nosso Serviço
import { db } from "../../service/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getById } from "../../service/firestoreService";

interface Exercicio {
  id: string; // Atualizado para string (IDs do Firebase)
  titulo: string;
  nivel: string | number; // Atualizado para aceitar "Básico", "Avançado", etc.
}

export default function Pacote_Lista() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [nomePacote, setNomePacote] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        setErro("ID do pacote não fornecido.");
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        // 1. Busca as informações do Pacote para exibir no título
        try {
          const dadosPacote: any = await getById("pacotes", id);
          if (dadosPacote && dadosPacote.nome) {
            setNomePacote(dadosPacote.nome);
          } else {
            setNomePacote("Pacote Sem Nome");
          }
        } catch (err) {
          console.error("Erro ao carregar o pacote:", err);
          setNomePacote("Erro ao carregar nome");
        }

        // 2. Busca a lista de exercícios filtrando pelo pacote_id
        const q = query(
          collection(db, "exercicios"),
          where("pacote_id", "==", id),
        );

        const querySnapshot = await getDocs(q);
        const dadosExercicios = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercicio[];

        setExercicios(dadosExercicios);
      } catch (err: any) {
        console.error("Erro ao buscar os exercícios:", err);
        setErro(err.message || "Erro ao buscar os exercícios.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  return (
    <div className="home-container">
      <Navbar />

      <div className="content" style={{ paddingTop: "100px" }}>
        <div className="pacote-lista-cabecalho">
          <button className="botao-voltar" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
          <div className="titulo-container">
            {/* Título dinâmico que mostra o nome do pacote atual */}
            <h1>Exercícios: {nomePacote || "A CARREGAR..."}</h1>
            <p>Escolha um exercício para começar a praticar.</p>
          </div>
        </div>

        {carregando && (
          <p className="status-mensagem">A carregar exercícios...</p>
        )}

        {erro && (
          <div className="status-mensagem erro">
            <strong>Erro:</strong> {erro}
          </div>
        )}

        {!carregando && !erro && exercicios.length === 0 && (
          <p className="status-mensagem">
            Nenhum exercício encontrado neste pacote ainda.
          </p>
        )}

        {!carregando && !erro && exercicios.length > 0 && (
          <div className="lista-exercicios-container">
            {exercicios.map((exercicio) => (
              <div key={exercicio.id} className="exercicio-card">
                <div className="exercicio-info">
                  <span className="exercicio-nivel">
                    Nível {exercicio.nivel || "Não definido"}
                  </span>
                  <h3>{exercicio.titulo || "Exercício sem título"}</h3>
                </div>

                <button
                  className="botao-abrir"
                  onClick={() => navigate(`/lista/exercicio/${exercicio.id}`)}
                >
                  Fazer Exercício
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Materia_Lista.css";
import Navbar from "../../components/Navbar";

// Importações do Firebase e do nosso Serviço
import { db } from "../../service/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getById } from "../../service/firestoreService";

interface Pacote {
  id: string; // IDs no Firebase são strings
  nome: string;
  descricao?: string;
}

export default function Materia_Usuario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [nomeMateria, setNomeMateria] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!id) {
        setCarregando(false);
        setNomeMateria("Matéria Não Encontrada");
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        // 1. Busca as informações da Matéria para o cabeçalho
        try {
          const dadosMateria: any = await getById("materias", id);
          if (dadosMateria && dadosMateria.nome) {
            setNomeMateria(dadosMateria.nome);
          } else {
            setNomeMateria("Matéria Sem Nome");
          }
        } catch (err) {
          console.error("Erro ao carregar matéria:", err);
          setNomeMateria("Erro ao Carregar Nome");
        }

        // 2. Busca a lista de pacotes filtrando pelo ID da matéria
        const q = query(
          collection(db, "pacotes"),
          where("materia_id", "==", id),
        );

        const querySnapshot = await getDocs(q);
        const dadosPacotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pacote[];

        setPacotes(dadosPacotes);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setErro(err.message || "Não foi possível carregar os dados.");
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
        {/* CABEÇALHO DA MATÉRIA */}
        <div
          className="materia-cabecalho"
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <h1
            style={{
              fontSize: "36px",
              textTransform: "uppercase",
              margin: "0 0 10px 0",
              color: "#000",
            }}
          >
            {nomeMateria || "A CARREGAR MATÉRIA..."}
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Selecione um pacote abaixo para iniciar os exercícios.
          </p>
        </div>

        <h2>Pacotes Disponíveis</h2>

        {carregando && <p className="status-mensagem">A carregar...</p>}
        {erro && <p className="status-mensagem erro">Erro: {erro}</p>}

        {!carregando && !erro && pacotes.length === 0 && (
          <p className="status-mensagem">
            Nenhum pacote encontrado para esta matéria.
          </p>
        )}

        {!carregando && !erro && pacotes.length > 0 && (
          <div className="lista-pacotes-container">
            {pacotes.map((pacote) => (
              <div key={pacote.id} className="pacote-card">
                <div className="pacote-info">
                  <h3>{pacote.nome}</h3>
                  {pacote.descricao && <p>{pacote.descricao}</p>}
                </div>

                <button
                  className="botao-abrir"
                  onClick={() => navigate(`/lista/pacote/${pacote.id}`)}
                >
                  Abrir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

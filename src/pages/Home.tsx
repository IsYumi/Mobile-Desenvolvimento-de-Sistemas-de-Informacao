import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Importamos a função do nosso serviço centralizado do Firestore
import { listarMaterias } from "../service/firestoreService";
import ursoGif from "../assets/urso.gif";
import "../styles/Home.css";

// O ID no Firebase é uma string
interface Materia {
  id: string;
  nome: string;
  descricao?: string;
}

export default function Home() {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMaterias() {
      try {
        setCarregando(true);
        setErro(null);

        // Chamada direta para o Firestore
        const dados = await listarMaterias();

        // Como criamos a função listarMaterias(), ela já retorna o array formatado
        setMaterias(dados as Materia[]);
      } catch (err: any) {
        console.error("Erro ao buscar matérias no Firebase:", err);
        setErro("Não foi possível carregar as matérias.");
      } finally {
        setCarregando(false);
      }
    }

    carregarMaterias();
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      <div className="content">
        {/* TÍTULO PRESERVADO */}
        <div className="titulo-section">
          <div className="titulo-text">
            <h2>O QUE VAMOS FAZER HOJE?</h2>
          </div>
          <img src={ursoGif} alt="urso mascote" className="urso-mascote" />
        </div>

        {/* FEEDBACK DE CARREGAMENTO/ERRO */}
        {carregando && (
          <p className="status-mensagem">Carregando matérias...</p>
        )}
        {erro && <p className="status-mensagem erro">Erro: {erro}</p>}

        {!carregando && !erro && materias.length === 0 && (
          <p className="status-mensagem">
            Nenhuma matéria disponível no momento.
          </p>
        )}

        {/* LISTAGEM DINÂMICA DE MATÉRIAS */}
        {!carregando && !erro && materias.length > 0 && (
          <div className="lista-pacotes-container">
            {materias.map((materia) => (
              <div key={materia.id} className="pacote-card">
                <div className="pacote-info">
                  <h3>{materia.nome}</h3>
                  {materia.descricao && <p>{materia.descricao}</p>}
                </div>
                <button
                  className="botao-abrir"
                  onClick={() => navigate(`/lista/materia/${materia.id}`)}
                >
                  Ver Pacotes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Exercicio_Fazer.css";

// Importa a função de leitura do Firestore
import { getById } from "../../service/firestoreService";

interface Exercicio {
  id: string; // Atualizado para string (formato do Firebase)
  titulo: string;
  pergunta: string;
  resposta: string;
  nivel: string | number; // Atualizado para aceitar as strings "Básico", "Intermediário", etc.
}

export default function Exercicio_Fazer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [exercicio, setExercicio] = useState<Exercicio | null>(null);
  const [respostaUsuario, setRespostaUsuario] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarExercicio() {
      if (!id) {
        setErro("ID do exercício não fornecido.");
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        // Busca o exercício diretamente na coleção "exercicios" no Firestore
        const dados = await getById("exercicios", id);

        if (dados) {
          setExercicio(dados as Exercicio);
        } else {
          throw new Error("Não foi possível carregar o exercício.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar o exercício:", err);
        setErro(err.message || "Erro ao buscar o exercício no banco de dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarExercicio();
  }, [id]);

  const handleConfirmar = () => {
    if (!exercicio) return;

    // Remove espaços extras e ignora maiúsculas/minúsculas para facilitar a validação
    const respostaCerta = exercicio.resposta.trim().toLowerCase();
    const respostaDigitada = respostaUsuario.trim().toLowerCase();

    if (respostaDigitada === respostaCerta) {
      alert("Correto! Parabéns, você acertou!");
      // Opcional: Se quiser que o app volte para a lista de exercícios automaticamente ao acertar:
      // navigate(-1);
    } else {
      alert(`Errado!\n\nA resposta certa era: ${exercicio.resposta}`);
    }

    // Limpa o input após a tentativa
    setRespostaUsuario("");
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="content" style={{ paddingTop: "100px" }}>
        <div className="exercicio-fazer-cabecalho">
          <button className="botao-voltar" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
          <div className="titulo-container">
            <h1>Resolvendo Exercício</h1>
          </div>
        </div>

        {carregando && (
          <p className="status-mensagem">A carregar exercício...</p>
        )}

        {erro && (
          <div className="status-mensagem erro">
            <strong>Erro:</strong> {erro}
          </div>
        )}

        {!carregando && !erro && exercicio && (
          <div className="exercicio-fazer-card">
            <div className="exercicio-header">
              <span className="exercicio-nivel">Nível {exercicio.nivel}</span>
              <h2>{exercicio.titulo}</h2>
            </div>

            <div className="exercicio-pergunta">
              <p>{exercicio.pergunta}</p>
            </div>

            <div className="exercicio-input-group">
              <label>Sua Resposta:</label>
              <input
                type="text"
                value={respostaUsuario}
                onChange={(e) => setRespostaUsuario(e.target.value)}
                placeholder="Escreva a resposta aqui..."
                onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
              />
            </div>

            <button className="botao-confirmar" onClick={handleConfirmar}>
              Confirmar Resposta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

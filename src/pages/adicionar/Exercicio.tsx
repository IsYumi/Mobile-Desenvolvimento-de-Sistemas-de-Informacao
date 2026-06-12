import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa a função para criar documentos no Firestore
import { create } from "../../service/firestoreService";

export default function Exercicio() {
  const navigate = useNavigate();

  const [pacote_id, setPacoteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [nivel, setNivel] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonAdicionarExercicio = async () => {
    // Validação básica
    if (!pacote_id || !titulo || !pergunta || !resposta || !nivel) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      // Salva o exercício na coleção "exercicios" no Firestore
      const idGerado = await create("exercicios", {
        pacote_id: pacote_id, // Vincula ao pacote criado anteriormente
        titulo: titulo,
        pergunta: pergunta,
        resposta: resposta,
        nivel: nivel,
        dataCriacao: new Date().toISOString(),
      });

      console.log("Exercício adicionado com ID:", idGerado);

      setPacoteId("");
      setTitulo("");
      setPergunta("");
      setResposta("");
      setNivel("");
      alert("Exercício adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar exercício:", error);
      alert("Erro ao salvar o exercício no banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>ID DO PACOTE (Vincular ao Pacote)</label>
            <input
              type="text" // Firebase IDs são strings
              name="pacote_id"
              value={pacote_id}
              onChange={(e) => setPacoteId(e.target.value)}
              disabled={loading}
              placeholder="Ex: a8bX9..."
            />

            <label>TÍTULO</label>
            <input
              type="text"
              name="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={loading}
            />

            <label>PERGUNTA</label>
            <input
              type="text"
              name="pergunta"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              disabled={loading}
            />

            <label>RESPOSTA</label>
            <input
              type="text"
              name="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              disabled={loading}
            />

            <label>NÍVEL</label>
            <input
              type="text"
              name="nivel"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              disabled={loading}
              placeholder="Ex: 1, 2, Básico..."
            />
          </div>

          <div className="buttons-container">
            <button
              className="btn-adicionar"
              onClick={buttonAdicionarExercicio}
              disabled={loading}
            >
              {loading ? "ADICIONANDO..." : "ADICIONAR EXERCÍCIO"}
            </button>
            <button
              className="btn-voltar"
              onClick={() => navigate(-1)}
              style={{ marginLeft: "10px" }}
              disabled={loading}
            >
              VOLTAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

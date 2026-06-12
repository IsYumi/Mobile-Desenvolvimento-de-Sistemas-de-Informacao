import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa a função para criar documentos no Firestore
import { create } from "../../service/firestoreService";

export default function Pacote() {
  const navigate = useNavigate();

  const [materia_id, setMateriaId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem_caminho, setImagemCaminho] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonAdicionarPacote = async () => {
    // Validação básica
    if (!materia_id || !nome) {
      alert("Por favor, preencha o ID da Matéria e o Nome do Pacote.");
      return;
    }

    try {
      setLoading(true);

      // Salva o pacote na coleção "pacotes" no Firestore
      const idGerado = await create("pacotes", {
        materia_id: materia_id, // Lembre-se: No Firebase, este ID será uma string!
        nome: nome,
        descricao: descricao,
        imagem_caminho: imagem_caminho,
        dataCriacao: new Date().toISOString(),
      });

      console.log("Pacote adicionado com ID:", idGerado);

      setMateriaId("");
      setNome("");
      setDescricao("");
      setImagemCaminho("");
      alert("Pacote adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar pacote:", error);
      alert("Erro ao adicionar o pacote no banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>ID DA MATÉRIA (Vincular pacote à matéria)</label>
            <input
              type="text" // Alterado para text porque IDs do Firebase são strings
              name="materia_id"
              value={materia_id}
              onChange={(e) => setMateriaId(e.target.value)}
              disabled={loading}
              placeholder="Ex: d8XjA9..."
            />

            <label>NOME DO PACOTE</label>
            <input
              type="text"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
            />

            <label>DESCRIÇÃO</label>
            <input
              type="text"
              name="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={loading}
            />

            <label>IMAGEM</label>
            <input
              type="text"
              name="imagem_caminho"
              value={imagem_caminho}
              onChange={(e) => setImagemCaminho(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="buttons-container">
            <button
              className="btn-adicionar"
              onClick={buttonAdicionarPacote}
              disabled={loading}
            >
              {loading ? "ADICIONANDO..." : "ADICIONAR PACOTE"}
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

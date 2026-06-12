import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Materia.css";

// Importa a função para criar documentos no Firestore
import { create } from "../../service/firestoreService";

export default function Materia() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [imagemNome, setImagemNome] = useState("");
  const [loading, setLoading] = useState(false); // Estado para evitar duplo clique

  const buttonAdicionarMateria = async () => {
    // Validação básica
    if (!nome) {
      alert("Por favor, preencha pelo menos o nome da matéria.");
      return;
    }

    try {
      setLoading(true);

      // Salva a matéria na coleção "materias" no Firestore
      // (Mantivemos a lógica de salvar apenas o nome da imagem como string por enquanto)
      const idGerado = await create("materias", {
        nome: nome,
        descricao: descricao,
        imagem_caminho: imagem,
        dataCriacao: new Date().toISOString(),
      });

      console.log("Matéria adicionada com ID:", idGerado);

      setNome("");
      setDescricao("");
      setImagem("");
      setImagemNome("");
      alert("Matéria adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar matéria:", error);
      alert("Erro ao adicionar a matéria no banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImagem(file.name);
      setImagemNome(file.name);
    }
  };

  return (
    <div className="materia-container">
      <div className="materia-header">
        <h1 className="materia-title">ADICIONAR MATÉRIA</h1>
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          VOLTAR
        </button>
      </div>

      <div className="materia-form">
        <div className="field-group">
          <label>NOME</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da matéria"
            disabled={loading}
          />
        </div>

        <div className="field-group">
          <label>DESCRIÇÃO</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição breve"
            disabled={loading}
          />
        </div>

        <div className="image-box">
          <label>IMAGEM / CAPA</label>
          <div className="image-upload-row">
            <button
              type="button"
              className="image-select-button"
              onClick={handleSelectImage}
              disabled={loading}
            >
              INSERIR IMAGEM
            </button>
            {imagemNome && <span className="image-name">{imagemNome}</span>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImagemChange}
          />
        </div>

        <div className="confirm-button-row">
          <button
            className="btn-confirmar"
            onClick={buttonAdicionarMateria}
            disabled={loading}
          >
            {loading ? "SALVANDO..." : "CONFIRMAR"}
          </button>
        </div>
      </div>
    </div>
  );
}

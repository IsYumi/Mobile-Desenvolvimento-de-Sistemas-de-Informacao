import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Editar_Materia.css";

// Importa as funções de Update e Delete do Firestore
import { update, remove } from "../../service/firestoreService";

export default function Editar_Materia() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [imagemNome, setImagemNome] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonEditarMateria = async () => {
    if (!id) {
      alert("Por favor, informe o ID da matéria que deseja editar.");
      return;
    }

    try {
      setLoading(true);

      // Atualiza o documento na coleção "materias" onde o documento = id
      await update("materias", id, {
        nome: nome,
        descricao: descricao,
        imagem_caminho: imagem,
        dataAtualizacao: new Date().toISOString(), // Opcional, bom para auditoria
      });

      console.log("Matéria alterada:", id);
      setNome("");
      setDescricao("");
      setImagem("");
      setImagemNome("");
      // Não limpamos o ID para caso o usuário queira deletar logo em seguida
      alert("Matéria alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar matéria:", error);
      alert("Erro ao alterar a matéria. Verifique se o ID está correto.");
    } finally {
      setLoading(false);
    }
  };

  const buttonDeletarMateria = async () => {
    if (!id) {
      alert("Por favor, informe o ID da matéria que deseja deletar.");
      return;
    }

    if (
      window.confirm(
        "Tem certeza que deseja DELETAR esta matéria permanentemente?",
      )
    ) {
      try {
        setLoading(true);

        // Remove o documento da coleção "materias"
        await remove("materias", id);

        console.log("Matéria deletada:", id);
        setId("");
        setNome("");
        setDescricao("");
        setImagem("");
        setImagemNome("");
        alert("Matéria deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar matéria:", error);
        alert("Erro ao deletar. Verifique se o ID está correto.");
      } finally {
        setLoading(false);
      }
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
    <>
      <Navbar />
      <div className="materia-container">
        <div className="materia-header">
          <h1 className="materia-title">EDITAR MATÉRIA</h1>
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            VOLTAR
          </button>
        </div>

        <div className="materia-form">
          <div className="field-group">
            <label>ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID da matéria (Gerado no Firebase)"
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label>NOME</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Novo nome da matéria"
              disabled={loading}
            />
          </div>

          <div className="text-area-group field-group">
            <label>DESCRIÇÃO</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Nova descrição"
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
              onClick={buttonEditarMateria}
              disabled={loading}
            >
              {loading ? "PROCESSANDO..." : "CONFIRMAR"}
            </button>
            <button
              className="btn-deletar"
              type="button"
              onClick={buttonDeletarMateria}
              disabled={loading}
            >
              DELETAR
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

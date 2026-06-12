import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Editar_Pacote.css";

// Importa as funções de Update e Delete do Firestore
import { update, remove } from "../../service/firestoreService";

export default function Editar_Pacote() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState("");
  // Nota: Baseado na sua estrutura original, 'nome' recebe o ID da Matéria e 'topico' recebe o Nome do Pacote
  const [nome, setNome] = useState("");
  const [topico, setTopico] = useState("");
  const [nivel, setNivel] = useState("Básico");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [imagemNome, setImagemNome] = useState("");
  const [questao, setQuestao] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonEditarPacote = async () => {
    if (!id) {
      alert("Por favor, informe o ID do pacote que deseja editar.");
      return;
    }

    try {
      setLoading(true);

      // Atualiza o documento na coleção "pacotes" onde o documento = id
      await update("pacotes", id, {
        materia_id: nome,
        nome: topico,
        nivel: nivel,
        descricao: descricao,
        imagem_caminho: imagem,
        questao: questao, // Salva o campo da text-area também
        dataAtualizacao: new Date().toISOString(),
      });

      console.log("Pacote alterado:", id);
      setNome("");
      setTopico("");
      setNivel("Básico");
      setDescricao("");
      setImagem("");
      setImagemNome("");
      setQuestao("");
      alert("Pacote alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar pacote:", error);
      alert("Erro ao alterar o pacote. Verifique se o ID está correto.");
    } finally {
      setLoading(false);
    }
  };

  const buttonDeletarPacote = async () => {
    if (!id) {
      alert("Por favor, informe o ID do pacote que deseja deletar.");
      return;
    }

    if (
      window.confirm(
        "Tem certeza que deseja DELETAR este pacote permanentemente?",
      )
    ) {
      try {
        setLoading(true);

        // Remove o documento da coleção "pacotes"
        await remove("pacotes", id);

        console.log("Pacote deletado:", id);
        setId("");
        setNome("");
        setTopico("");
        setNivel("Básico");
        setDescricao("");
        setImagem("");
        setImagemNome("");
        setQuestao("");
        alert("Pacote deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar pacote:", error);
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
          <h1 className="materia-title">EDITAR PACOTE</h1>
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
              placeholder="ID do pacote (Gerado no Firebase)"
              disabled={loading}
            />
          </div>
          <div className="field-group">
            <label>ID DA MATÉRIA</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Id da matéria vinculada"
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label>TÓPICO (NOME DO PACOTE)</label>
            <input
              type="text"
              value={topico}
              onChange={(e) => setTopico(e.target.value)}
              placeholder="Nome do pacote/tópico"
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label>NÍVEL</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="Básico"
                  checked={nivel === "Básico"}
                  onChange={() => setNivel("Básico")}
                  disabled={loading}
                />
                BÁSICO
              </label>
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="Intermediário"
                  checked={nivel === "Intermediário"}
                  onChange={() => setNivel("Intermediário")}
                  disabled={loading}
                />
                INTERMEDIÁRIO
              </label>
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="Avançado"
                  checked={nivel === "Avançado"}
                  onChange={() => setNivel("Avançado")}
                  disabled={loading}
                />
                AVANÇADO
              </label>
            </div>
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

          <div className="text-area-group field-group">
            <label>QUESTÃO / ATIVIDADE</label>
            <textarea
              value={questao}
              onChange={(e) => setQuestao(e.target.value)}
              placeholder="Descreva a questão ou atividade"
              disabled={loading}
            />
          </div>

          <div className="confirm-button-row">
            <button
              className="btn-confirmar"
              onClick={buttonEditarPacote}
              disabled={loading}
            >
              {loading ? "PROCESSANDO..." : "CONFIRMAR"}
            </button>
            <button
              className="btn-deletar"
              type="button"
              onClick={buttonDeletarPacote}
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

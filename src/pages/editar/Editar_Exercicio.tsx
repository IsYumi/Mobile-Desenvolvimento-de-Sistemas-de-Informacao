import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

// Importa as funções de Update e Delete do Firestore
import { update, remove } from "../../service/firestoreService";

export default function Editar_Exercicio() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pacote_id, setPacoteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [nivel, setNivel] = useState("");

  const [loading, setLoading] = useState(false);

  const buttonEditarExercicio = async () => {
    if (!id) {
      alert("Por favor, informe o ID do exercício que deseja editar.");
      return;
    }

    try {
      setLoading(true);

      // Atualiza o documento na coleção "exercicios"
      await update("exercicios", id, {
        pacote_id: pacote_id,
        titulo: titulo,
        pergunta: pergunta,
        resposta: resposta,
        nivel: nivel,
        dataAtualizacao: new Date().toISOString(),
      });

      console.log("Exercício alterado:", id);

      // Limpa os campos de texto após a edição
      setPacoteId("");
      setTitulo("");
      setPergunta("");
      setResposta("");
      setNivel("");

      alert("Exercício alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar exercício:", error);
      alert("Erro ao alterar o exercício. Verifique se o ID está correto.");
    } finally {
      setLoading(false);
    }
  };

  const buttonDeletarExercicio = async () => {
    if (!id) {
      alert("Por favor, informe o ID do exercício que deseja deletar.");
      return;
    }

    if (
      window.confirm(
        "Tem a certeza que deseja DELETAR este exercício permanentemente?",
      )
    ) {
      try {
        setLoading(true);

        // Remove o documento da coleção "exercicios"
        await remove("exercicios", id);

        console.log("Exercício removido:", id);

        // Limpa tudo
        setId("");
        setPacoteId("");
        setTitulo("");
        setPergunta("");
        setResposta("");
        setNivel("");

        alert("Exercício removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover exercício:", error);
        alert("Erro ao remover. Verifique se o ID está correto.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Adicionei a Navbar para manter a consistência visual com as outras páginas de edição */}
      <Navbar />

      <div
        className="form-container"
        style={{ paddingTop: "100px", maxWidth: "800px", margin: "0 auto" }}
      >
        <div
          className="materia-header"
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>EDITAR EXERCÍCIO</h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              background: "#ff9d94",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            VOLTAR
          </button>
        </div>

        <div className="form-row">
          <div
            className="form-group"
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                ID DO EXERCÍCIO
              </label>
              <input
                type="text"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="ID gerado no Firebase"
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                ID DO PACOTE VINCULADO
              </label>
              <input
                type="text"
                name="pacote_id"
                value={pacote_id}
                onChange={(e) => setPacoteId(e.target.value)}
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                TÍTULO
              </label>
              <input
                type="text"
                name="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                PERGUNTA
              </label>
              <input
                type="text"
                name="pergunta"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                RESPOSTA
              </label>
              <input
                type="text"
                name="resposta"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                NÍVEL
              </label>
              <input
                type="text"
                name="nivel"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                disabled={loading}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <div
            className="buttons-container"
            style={{ display: "flex", gap: "15px", marginTop: "20px" }}
          >
            <button
              onClick={buttonEditarExercicio}
              disabled={loading}
              style={{
                flex: 1,
                padding: "15px",
                background: "#63ff96",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {loading ? "A PROCESSAR..." : "CONFIRMAR ALTERAÇÕES"}
            </button>
            <button
              onClick={buttonDeletarExercicio}
              disabled={loading}
              style={{
                flex: 1,
                padding: "15px",
                background: "#ff9d94",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              REMOVER EXERCÍCIO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

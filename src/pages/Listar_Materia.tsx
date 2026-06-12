import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listar_Materia.css";

// Importa a função do nosso novo service centralizado
import { listarMaterias, remove } from "../service/firestoreService";

export default function Listar_Materia() {
  const navigate = useNavigate();

  // Estado para guardar as matérias que vêm do banco de dados
  const [materias, setMaterias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os dados assim que a tela abre
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      const dados = await listarMaterias();
      setMaterias(dados);
    } catch (erro) {
      console.error("Erro ao buscar matérias:", erro);
    } finally {
      setCarregando(false);
    }
  }

  // Função para deletar usando o service centralizado
  async function handleDeletar(id: string) {
    if (window.confirm("Tem certeza que deseja deletar esta matéria?")) {
      try {
        await remove("materias", id); // Chama a função genérica de deleção
        // Atualiza a lista na tela removendo o item deletado
        setMaterias(materias.filter((m) => m.id !== id));
      } catch (erro) {
        console.error("Erro ao deletar:", erro);
      }
    }
  }

  return (
    <div className="listar-materia-container">
      <div className="listar-materia-header">
        <h1 className="listar-materia-title">LISTAR MATÉRIA</h1>
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          VOLTAR
        </button>
      </div>

      <div className="listar-materia-table-wrapper">
        <table className="listar-materia-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>MATÉRIA</th>
              <th>TÓPICO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={4}>Carregando dados...</td>
              </tr>
            ) : materias.length === 0 ? (
              <tr>
                <td colSpan={4}>Nenhuma matéria cadastrada.</td>
              </tr>
            ) : (
              materias.map((materia) => (
                <tr key={materia.id}>
                  {/* Pega apenas os primeiros caracteres do ID para não quebrar o layout */}
                  <td>{materia.id.substring(0, 6)}...</td>
                  <td>{materia.nome}</td>
                  <td>{materia.topico}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-editar"
                        type="button"
                        onClick={() =>
                          navigate(`/editar/materia?id=${materia.id}`)
                        }
                      >
                        EDITAR
                      </button>
                      <button
                        className="btn-deletar"
                        type="button"
                        onClick={() => handleDeletar(materia.id)}
                      >
                        DELETAR
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

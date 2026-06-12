import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Assinatura.css";

// Importações do Firebase
import { auth } from "../service/firebaseConfig";
import { create, update } from "../service/firestoreService";

export default function Assinatura() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [numero_cartao, setCartao] = useState("");
  const [data_validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssinarPlano = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("Você precisa estar logado para assinar um plano.");
        navigate("/login");
        return;
      }

      if (!nome || !sobrenome || !numero_cartao || !data_validade || !cvv) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      setLoading(true);

      // 1. Salva os dados do cartão em uma coleção "cartoes" vinculada ao usuário
      await create("cartoes", {
        userId: currentUser.uid,
        nome,
        sobrenome,
        numero_cartao,
        data_validade,
        cvv,
        dataAssinatura: new Date().toISOString(),
      });

      // 2. (Opcional) Atualiza o status do usuário para PREMIUM no Firestore
      await update("users", currentUser.uid, {
        plano: "PREMIUM",
      });

      // Limpa os campos
      setNome("");
      setSobrenome("");
      setCartao("");
      setValidade("");
      setCvv("");

      alert("Assinatura concluída com sucesso!");
      navigate("/perfil"); // Redireciona de volta para o perfil após assinar
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      alert("Erro ao processar a assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="materia-container">
      <div className="materia-header">
        <h1 className="materia-title">ASSINAR PLANO</h1>
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
            placeholder="Nome"
            disabled={loading}
          />
        </div>

        <div className="field-group">
          <label>SOBRENOME</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Sobrenome"
            disabled={loading}
          />
        </div>
        <div className="materia-form">
          <div className="field-group">
            <label>NÚMERO DO CARTÃO</label>
            <input
              type="text"
              value={numero_cartao}
              onChange={(e) => setCartao(e.target.value)}
              placeholder="Número do cartão"
              disabled={loading}
            />
          </div>

          <div className="materia-form">
            <div className="field-group">
              <label>DATA DE VALIDADE</label>
              <input
                type="text"
                value={data_validade}
                onChange={(e) => setValidade(e.target.value)}
                placeholder="MM/AA"
                disabled={loading}
              />
            </div>
          </div>

          <div className="materia-form">
            <div className="field-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                disabled={loading}
              />
            </div>
          </div>
          <div className="confirm-button-row">
            <button
              className="btn-confirmar"
              onClick={handleAssinarPlano}
              disabled={loading}
            >
              {loading ? "PROCESSANDO..." : "CONFIRMAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

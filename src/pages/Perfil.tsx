import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Perfil.css";
import { useNavigate } from "react-router-dom";

// Importações do Firebase
import { auth } from "../service/firebaseConfig";
import { getUserProfile } from "../service/firestoreService";

export default function Perfil() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [genero, setGenero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateDados = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }

        // Busca os dados diretamente do Firestore
        const data: any = await getUserProfile(currentUser.uid);

        setNome(data.nome || "");
        setSobrenome(data.sobrenome || "");
        setGenero(data.genero || "");
        setTelefone(data.telefone || "");
        setEmail(data.email || currentUser.email || "");
      } catch (erro) {
        console.error("Erro ao carregar dados do perfil:", erro);
      } finally {
        setLoading(false);
      }
    };

    updateDados();
  }, [navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="perfil-page">
      <Navbar />
      <div className="perfil-container">
        <div className="perfil-card">
          <div className="perfil-header">
            <h1>MEU PERFIL</h1>
          </div>

          <div className="perfil-grid">
            <div className="perfil-column">
              <div className="perfil-field">
                <label>Nome</label>
                <input type="text" value={nome} readOnly />
              </div>
              <div className="perfil-field">
                <label>Telefone</label>
                <input type="text" value={telefone} readOnly />
              </div>
              <div className="perfil-field">
                <label>Gênero</label>
                <div className="perfil-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="genero"
                      checked={genero === "F"}
                      readOnly
                    />
                    Feminino
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="genero"
                      checked={genero === "M"}
                      readOnly
                    />
                    Masculino
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="genero"
                      checked={genero === "O" || genero === "Outro"}
                      readOnly
                    />
                    Não informar
                  </label>
                </div>
              </div>
              <div className="perfil-plan-box">
                <span>Tipo de plano</span>
                <strong>FREE</strong>
              </div>
              <button
                className="perfil-button perfil-button-primary"
                onClick={() => navigate("/assinatura")}
              >
                ASSINAR PLANO
              </button>
            </div>

            <div className="perfil-column">
              <div className="perfil-field">
                <label>Sobrenome</label>
                <input type="text" value={sobrenome} readOnly />
              </div>
              <div className="perfil-field">
                <label>E-mail</label>
                <input type="email" value={email} readOnly />
              </div>
              <button
                className="perfil-button perfil-button-secondary"
                onClick={() => navigate("/update")}
              >
                EDITAR INFORMAÇÕES
              </button>

              {/* O botão de deletar conta direciona para o Update, onde a lógica já existe */}
              <button
                className="perfil-button perfil-button-danger"
                onClick={() => navigate("/update")}
              >
                DELETAR CONTA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

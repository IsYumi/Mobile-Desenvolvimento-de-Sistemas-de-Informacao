import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPag from "../assets/logo_pag.png";
import "../styles/Update.css";

// Importações do Firebase
import { auth } from "../service/firebaseConfig";
import { signOut, deleteUser } from "firebase/auth";
import { getUserProfile, update, remove } from "../service/firestoreService";

export default function Update() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    genero: "",
  });

  const [loading, setLoading] = useState(true);

  // 1. BUSCAR DADOS DO FIRESTORE
  useEffect(() => {
    async function buscarPerfil() {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }

        const dados: any = await getUserProfile(currentUser.uid);

        setPerfil({
          nome: dados.nome || "",
          sobrenome: dados.sobrenome || "",
          email: dados.email || currentUser.email || "",
          telefone: dados.telefone || "",
          genero: dados.genero || "",
        });
      } catch (erro) {
        console.error("Erro ao buscar perfil no Firebase:", erro);
      } finally {
        setLoading(false);
      }
    }

    buscarPerfil();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
  };

  const handleGeneroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerfil({ ...perfil, genero: e.target.value });
  };

  // 2. ATUALIZAR DADOS NO FIRESTORE
  const handleEditarInformacoes = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Chama a função genérica de update passando a coleção "users"
      await update("users", currentUser.uid, perfil);
      alert("Informações atualizadas com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar:", erro);
      alert("Erro ao atualizar informações");
    }
  };

  // 3. DELETAR CONTA (Firestore + Auth)
  const handleDeletarConta = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja deletar sua conta? Essa ação é irreversível.",
      )
    ) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Primeiro, apaga o documento do usuário no banco de dados (Firestore)
        await remove("users", currentUser.uid);

        // Depois, exclui o usuário da Autenticação do Firebase
        await deleteUser(currentUser);

        alert("Conta deletada com sucesso!");
        navigate("/login");
      } catch (erro: any) {
        console.error("Erro ao deletar:", erro);
        // O Firebase exige login recente para deletar a conta por segurança
        if (erro.code === "auth/requires-recent-login") {
          alert(
            "Para deletar a conta, você precisa ter feito login recentemente. Por favor, saia, entre novamente e repita a ação.",
          );
        } else {
          alert("Erro ao deletar conta");
        }
      }
    }
  };

  // 4. FAZER LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga do Firebase
      alert("Logout realizado com sucesso!");
      navigate("/login");
    } catch (erro) {
      console.error("Erro ao fazer logout:", erro);
      alert("Erro ao fazer logout");
      navigate("/login");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="update-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logoPag} alt="logo" className="logo" />
        </div>

        <div className="nav-center">
          <a href="/home" className="nav-link">
            MATÉRIAS
          </a>
          <a href="#" className="nav-link">
            DESEMPENHO
          </a>
          <a href="/update" className="nav-link active">
            MEU PERFIL
          </a>
        </div>

        <div className="nav-right">
          <button className="btn-sair" onClick={handleLogout}>
            SAIR
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="content">
        <h1>MEU PERFIL</h1>

        <div className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label>NOME</label>
              <input
                type="text"
                name="nome"
                value={perfil.nome}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>SOBRENOME</label>
              <input
                type="text"
                name="sobrenome"
                value={perfil.sobrenome}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>TELEFONE</label>
              <input
                type="text"
                name="telefone"
                value={perfil.telefone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>E-MAIL</label>
              <input
                type="email"
                name="email"
                value={perfil.email}
                onChange={handleInputChange}
                disabled // Desabilitado por segurança (mudança de email no Firebase requer verificação)
                style={{ cursor: "not-allowed", backgroundColor: "#e9ecef" }}
              />
            </div>
          </div>

          <div className="form-group-full">
            <label>GÊNERO</label>
            <div className="genero-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="genero"
                  value="F"
                  checked={perfil.genero === "F"}
                  onChange={handleGeneroChange}
                />
                FEMININO
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="genero"
                  value="M"
                  checked={perfil.genero === "M"}
                  onChange={handleGeneroChange}
                />
                MASCULINO
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="genero"
                  value="O"
                  checked={perfil.genero === "O" || perfil.genero === "Outro"}
                  onChange={handleGeneroChange}
                />
                NÃO INFORMAR
              </label>
            </div>
          </div>

          <div className="form-group-full">
            <label>TIPO DE PLANO</label>
            <div className="plan-type">FREE</div>
          </div>

          <div className="buttons-container">
            <button
              className="btn-assinar"
              onClick={() => navigate("/assinatura")}
            >
              ASSINAR PLANO
            </button>
            <button className="btn-editar" onClick={handleEditarInformacoes}>
              EDITAR INFORMAÇÕES
            </button>
          </div>

          <button className="btn-deletar" onClick={handleDeletarConta}>
            DELETAR CONTA
          </button>
        </div>
      </div>
    </div>
  );
}

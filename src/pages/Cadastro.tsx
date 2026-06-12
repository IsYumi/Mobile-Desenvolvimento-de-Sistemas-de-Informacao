import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarFirebase } from "../service/authService";
import "../styles/Login.css";

export default function Cadastro() {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("M");

  // Estados de controle da interface
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação básica
    if (!nome || !email || !senha || !genero) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);

      // Chama a função do Firebase que cria a conta e salva os dados no Firestore
      await cadastrarFirebase(email, senha, nome, genero);

      // O Firebase Auth faz login automaticamente após o cadastro.
      // Redirecionamos direto para as Boas Vindas.
      navigate("/boasvindas");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);

      // Tratamento de erros comuns do Firebase
      if (error.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está em uso.");
      } else if (error.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        setErro("O formato do e-mail é inválido.");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="titulo-login">CADASTRO</h1>

        {/* Exibição de Erros */}
        {erro && (
          <div
            style={{
              color: "#d93025",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleCadastro}>
          <div className="form-group">
            <label>NOME COMPLETO</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="form-group">
            <label>E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label>SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha forte"
            />
          </div>

          <div className="form-group">
            <label>GÊNERO</label>
            {/* Select estilizado com os mesmos padrões do input no Login.css */}
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              style={{
                display: "block",
                marginTop: "8px",
                width: "348px",
                padding: "12px",
                borderRadius: "12px",
                border: "solid 1.5px",
                background: "#d9d7d7c9",
                outline: "none",
                marginBottom: "18px",
                color: "#000",
                cursor: "pointer",
              }}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Prefiro não informar</option>
            </select>
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? "CADASTRANDO..." : "CADASTRAR"}
          </button>
        </form>

        <Link
          to="/login"
          className="link-senha"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          Já tem uma conta? Faça Login
        </Link>
      </div>

      <div className="login-right">
        {/* Mantendo o lado direito com um fundo sólido, ou você pode adicionar a tag <img> como no Login */}
        <div
          style={{ width: "100%", height: "100%", background: "#7fb4b2" }}
        ></div>
      </div>
    </div>
  );
}

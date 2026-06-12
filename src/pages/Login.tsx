// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginFirebase } from "../service/authService";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      // Chama a função real de login do seu authService
      await loginFirebase(email, senha);

      // Após o login com sucesso, redireciona para a Home
      navigate("/home");
    } catch (error: any) {
      console.error("Erro no login:", error);
      setErro("E-mail ou senha incorretos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="titulo-login">LOGIN</h1>

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

        <form onSubmit={handleLogin}>
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
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <Link
          to="/cadastro"
          className="link-senha"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          Não tem uma conta? Cadastre-se
        </Link>
      </div>

      <div className="login-right">
        <div
          style={{ width: "100%", height: "100%", background: "#7fb4b2" }}
        ></div>
      </div>
    </div>
  );
}

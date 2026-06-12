import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarFirebase } from "../service/authService";
import { gerarOtp } from "../service/otpService";
import { enviarOtpEmail } from "../service/emailService";
import "../styles/Login.css";

export default function Cadastro() {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("M");

  // Estados do OTP
  const [otpGerado, setOtpGerado] = useState("");
  const [otpDigitado, setOtpDigitado] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  // Estados de controle
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Passo 1: Enviar o código para o e-mail
  const handleEnviarCodigo = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome || !email || !senha || !genero) {
      setErro("Preencha todos os campos antes de enviar o código.");
      return;
    }

    try {
      setCarregando(true);

      // Gera o código de 6 dígitos do seu service
      const codigo = gerarOtp();
      setOtpGerado(codigo);

      // Dispara o e-mail usando o EmailJS
      await enviarOtpEmail(email, codigo);

      setCodigoEnviado(true);
      setSucesso("Código enviado! Verifique seu e-mail.");
    } catch (error) {
      console.error("Erro ao enviar OTP:", error);
      setErro("Falha ao enviar o código para o e-mail.");
    } finally {
      setCarregando(false);
    }
  };

  // Passo 2: Validar o OTP e Cadastrar no Firebase
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (otpDigitado !== otpGerado) {
      setErro("Código incorreto. Verifique o e-mail e tente novamente.");
      return;
    }

    try {
      setCarregando(true);

      // Se o código bater, cria a conta no Firebase
      await cadastrarFirebase(email, senha, nome, genero);
      navigate("/boasvindas");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);

      if (error.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está em uso.");
      } else if (error.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
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

        {/* Exibição de Mensagens */}
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
        {sucesso && (
          <div
            style={{
              color: "#28a745",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {sucesso}
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
              disabled={codigoEnviado} // Bloqueia edição após enviar código
            />
          </div>

          <div className="form-group">
            <label>E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              disabled={codigoEnviado}
            />
          </div>

          <div className="form-group">
            <label>SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha forte"
              disabled={codigoEnviado}
            />
          </div>

          <div className="form-group">
            <label>GÊNERO</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              disabled={codigoEnviado}
              style={{
                display: "block",
                marginTop: "8px",
                width: "348px",
                padding: "12px",
                borderRadius: "12px",
                border: "solid 1.5px",
                background: codigoEnviado ? "#e9e9e9" : "#d9d7d7c9",
                outline: "none",
                marginBottom: "18px",
                color: "#000",
                cursor: codigoEnviado ? "not-allowed" : "pointer",
              }}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Prefiro não informar</option>
            </select>
          </div>

          {/* Renderização condicional do campo de OTP */}
          {codigoEnviado && (
            <div className="form-group">
              <label>CÓDIGO DE VERIFICAÇÃO</label>
              <input
                type="text"
                value={otpDigitado}
                onChange={(e) => setOtpDigitado(e.target.value)}
                placeholder="Digite os 6 dígitos"
                maxLength={6}
              />
            </div>
          )}

          {/* Troca os botões dependendo se o código já foi enviado */}
          {!codigoEnviado ? (
            <button
              type="button"
              className="btn-codigo"
              onClick={handleEnviarCodigo}
              disabled={carregando}
            >
              {carregando ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
            </button>
          ) : (
            <button type="submit" className="btn-login" disabled={carregando}>
              {carregando ? "CADASTRANDO..." : "CADASTRAR"}
            </button>
          )}
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
        <div
          style={{ width: "100%", height: "100%", background: "#7fb4b2" }}
        ></div>
      </div>
    </div>
  );
}

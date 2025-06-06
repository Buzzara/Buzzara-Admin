import "../styles/registro.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarNovoUsuario } from "../services/registroNovoUsuario/registrarNovoUsuario";
import { RegistrarNovoUsuarioParams } from "../types/RegistroNovoUsuario/useRegistrarNovoUsuario";
import { FcGoogle } from "react-icons/fc";

export default function Registro() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState<RegistrarNovoUsuarioParams>({
    nomeCompleto: "",
    telefone: "",
    email: "",
    cpf: "",
    genero: "",
    senha: "",
    confirmaSenha: "",
    dataNascimento: "",
  });
  const [erro, setErro] = useState<string | null>(null);
  const [termosAceitos, setTermosAceitos] = useState(false);

  function aoAlterar(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();

    if (formulario.senha !== formulario.confirmaSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (!termosAceitos) {
      setErro("Você deve aceitar os termos e condições.");
      return;
    }

    const dataISO = new Date(formulario.dataNascimento).toISOString();
    const dadosParaEnviar = {
      ...formulario,
      dataNascimento: dataISO,
    };

    console.log(
      ">> [Registro] Valor atual de formulario.telefone:",
      formulario.telefone
    );
    console.log(
      ">> [Registro] Payload completo que será enviado ao backend:",
      dadosParaEnviar
    );
    // ------------------------------------------------------------

    try {
      await registrarNovoUsuario(dadosParaEnviar);
      navigate("/login");
    } catch (err) {
      setErro("Erro ao registrar. Verifique os dados.");
      console.error(">> [Registro] Erro na chamada registrarUsuario:", err);
    }
  }

  function registrarComGoogle() {
    console.log("Registrar com Google");
  }

  return (
    <div className="container-registro">
      <div className="formulario-registro">
        <h2>Crie sua conta</h2>
        <p>
          Já tem uma conta? <a href="/login">Fazer login</a>
        </p>

        <form onSubmit={aoEnviar}>
          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <input
            type="text"
            name="nomeCompleto"
            placeholder="Nome completo"
            value={formulario.nomeCompleto}
            onChange={aoAlterar}
            required
          />

          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formulario.telefone}
            onChange={aoAlterar}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formulario.email}
            onChange={aoAlterar}
            required
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formulario.cpf}
            onChange={aoAlterar}
            required
          />

          <input
            type="date"
            name="dataNascimento"
            value={formulario.dataNascimento}
            onChange={aoAlterar}
            required
          />

          <select
            name="genero"
            value={formulario.genero}
            onChange={aoAlterar}
            required
          >
            <option value="">Selecione o gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formulario.senha}
            onChange={aoAlterar}
            required
          />

          <input
            type="password"
            name="confirmaSenha"
            placeholder="Confirmar senha"
            value={formulario.confirmaSenha}
            onChange={aoAlterar}
            required
          />

          <label className="checkbox-termos">
            <input
              type="checkbox"
              checked={termosAceitos}
              onChange={() => setTermosAceitos(!termosAceitos)}
            />
            <span>
              Li e aceito os <a href="#">Termos e Condições</a>
            </span>
          </label>

          <button type="submit" disabled={!termosAceitos}>
            Registrar
          </button>

          <div className="divisor-ou">
            <span>OU</span>
          </div>

          <button
            type="button"
            className="botao-google"
            onClick={registrarComGoogle}
          >
            <FcGoogle size={20} style={{ marginRight: "8px" }} />
            <span>Registrar com Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}

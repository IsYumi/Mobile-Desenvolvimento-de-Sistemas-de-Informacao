import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import SplashScreen from "./pages/SplashScreen";
import BoasVindas from "./pages/BoasVindas";
import Home from "./pages/Home";
import Update from "./pages/Update";
import Perfil from "./pages/Perfil";
import Materia from "./pages/adicionar/Materia";
import Editar_Materia from "./pages/editar/Editar_Materia";
import Pacote from "./pages/adicionar/Pacote";
import Exercicio from "./pages/adicionar/Exercicio";
import Editar_Pacote from "./pages/editar/Editar_Pacote";
import Assinatura from "./pages/Assinatura";
import Editar_Exercicio from "./pages/editar/Editar_Exercicio";
import Materia_Usuario from "./pages/listar/Materia_Lista";
import Pacote_Lista from "./pages/listar/Pacote_Lista";
import Exercicio_Fazer from "./pages/listar/Exercicio_Fazer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boasvindas" element={<BoasVindas />} />
        <Route path="/home" element={<Home />} />
        <Route path="/update" element={<Update />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/assinatura" element={<Assinatura />} />

        <Route path="add/materia" element={<Materia />} />
        <Route path="add/pacote" element={<Pacote />} />
        <Route path="add/exercicio" element={<Exercicio />} />

        <Route path="editar/materia" element={<Editar_Materia />} />
        <Route path="editar/pacote" element={<Editar_Pacote />} />
        <Route path="editar/exercicio" element={<Editar_Exercicio />} />

        <Route path="lista/materia/:id" element={<Materia_Usuario />} />
        <Route path="lista/pacote/:id" element={<Pacote_Lista />} />
        <Route path="lista/exercicio/:id" element={<Exercicio_Fazer />} />
      </Routes>
    </BrowserRouter>
  );
}

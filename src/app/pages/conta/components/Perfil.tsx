import { Acessos } from "./partials/Acessos";
import { Detalhes } from "./partials/Detalhes";
import { Seguranca } from "./partials/Seguranca";

export function Perfil() {
  return (
    <>
      <Detalhes />
      <Seguranca />
      <Acessos />
    </>
  )
}

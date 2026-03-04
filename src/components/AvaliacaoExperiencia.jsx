import { useState } from "react";
import AvaliacaoExperiencia1 from "./AvaliacaoExperiencia1";
import AvaliacaoExperiencia2 from "./AvaliacaoExperiencia2";

const AvaliacaoExperiencia = () => {
  const [tipoAvaliacao, setTipoAvaliacao] = useState("avaliacao-exp1");

  return (
    <div>
      <div className="form-row" style={{ marginBottom: "1rem" }}>
        <div className="form-group">
          <label>Tipo</label>
          <select
            value={tipoAvaliacao}
            onChange={(e) => setTipoAvaliacao(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="avaliacao-exp1">Avaliação Experiência 1</option>
            <option value="avaliacao-exp2">Avaliação Experiência 2</option>
          </select>
        </div>
      </div>

      {tipoAvaliacao === "avaliacao-exp1" && <AvaliacaoExperiencia1 />}
      {tipoAvaliacao === "avaliacao-exp2" && <AvaliacaoExperiencia2 />}
    </div>
  );
};

export default AvaliacaoExperiencia;

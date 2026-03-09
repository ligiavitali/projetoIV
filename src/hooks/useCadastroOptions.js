import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { normalizeDatesInPayload } from "../lib/dateUtils";

export default function useCadastroOptions() {
  const [pessoas, setPessoas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [itensAvaliacao, setItensAvaliacao] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [pessoasRes, empresasRes, funcoesRes, itensAvaliacaoRes] = await Promise.all([
          api.get("/pessoas"),
          api.get("/empresas"),
          api.get("/funcoes-cargos"),
          api.get("/itens-avaliacao"),
        ]);

        const pessoasData = Array.isArray(pessoasRes.data) ? pessoasRes.data : [];
        setPessoas(normalizeDatesInPayload(pessoasData));
        setEmpresas(Array.isArray(empresasRes.data) ? empresasRes.data : []);
        setFuncoes(Array.isArray(funcoesRes.data) ? funcoesRes.data : []);
        setItensAvaliacao(
          Array.isArray(itensAvaliacaoRes.data) ? itensAvaliacaoRes.data : []
        );
      } catch (error) {
        console.error("Erro ao carregar opcoes de cadastro:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const alunos = useMemo(
    () => pessoas.filter((pessoa) => (pessoa.perfil || "").toLowerCase() === "aluno"),
    [pessoas]
  );

  const professores = useMemo(
    () => pessoas.filter((pessoa) => (pessoa.perfil || "").toLowerCase() === "professor"),
    [pessoas]
  );

  return {
    pessoas,
    alunos,
    professores,
    empresas,
    funcoes,
    itensAvaliacao,
    loadingOptions,
  };
}

import { normalizeDateForInput } from "../lib/dateUtils";

export const filtrarNomeSemNumeros = (valor) => valor.replace(/[0-9]/g, "");

export const mapPessoaApiToForm = (item) => {
  const perfil = String(item.perfil || item.cargo || "").toLowerCase();
  const cargo =
    perfil === "professor" ? "Professor" : perfil === "aluno" ? "Aluno" : "";

  const statusRaw = String(item.status || "").toLowerCase();
  const status =
    statusRaw === "ativo"
      ? "Ativo"
      : statusRaw === "inativo"
        ? "Inativo"
        : item.status || "";

  const usa = String(item.usa_medicamento || "").toLowerCase();
  const usa_medicamento =
    usa === "sim"
      ? "Sim"
      : usa === "nao" || usa === "não"
        ? "Não"
        : item.usa_medicamento || "";

  return {
    id: item.id ?? "",
    nome: item.nome ?? "",
    email: item.email ?? "",
    telefone: item.telefone ?? "",
    cpf: item.cpf ?? "",
    cargo,
    dataIngresso: normalizeDateForInput(item.data_ingresso ?? item.dataIngresso),
    data_nascimento: normalizeDateForInput(item.data_nascimento),
    nome_responsavel: item.nome_responsavel ?? "",
    telefone_responsavel: item.telefone_responsavel ?? "",
    usa_medicamento,
    info_medicamentos: item.info_medicamentos ?? "",
    status,
  };
};

export const pessoaFormToApi = (form) => {
  const perfil =
    form.cargo === "Professor"
      ? "professor"
      : form.cargo === "Aluno"
        ? "aluno"
        : null;
  const status =
    form.status === "Ativo"
      ? "ativo"
      : form.status === "Inativo"
        ? "inativo"
        : form.status;
  const usa_medicamento =
    form.usa_medicamento === "Sim"
      ? "sim"
      : form.usa_medicamento === "Não"
        ? "nao"
        : form.usa_medicamento || null;

  return {
    id: form.id,
    nome: form.nome,
    email: form.email,
    telefone: form.telefone || null,
    cpf: form.cpf || null,
    perfil,
    data_ingresso: form.dataIngresso || null,
    data_nascimento: form.data_nascimento || null,
    nome_responsavel: form.nome_responsavel || null,
    telefone_responsavel: form.telefone_responsavel || null,
    usa_medicamento,
    info_medicamentos: form.info_medicamentos || null,
    status,
  };
};

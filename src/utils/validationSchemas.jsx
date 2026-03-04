// src/utils/validationSchemas.js
import * as yup from "yup";

// 🔹 Pessoas
export const pessoasSchema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  telefone: yup
    .string()
    .required("O telefone é obrigatório")
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido"),
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido"),
  cargo: yup
    .string()
    .oneOf(["Professor", "Aluno"], "Perfil inválido")
    .required("O perfil é obrigatório"),
  status: yup
    .string()
    .oneOf(["Ativo", "Inativo"], "Status inválido")
    .required("O status é obrigatório"),
  dataIngresso: yup.string().when("cargo", {
    is: "Aluno",
    then: (schema) => schema.required("A data de ingresso é obrigatória"),
    otherwise: (schema) => schema.notRequired(),
  }),
  data_nascimento: yup.string().when("cargo", {
    is: "Aluno",
    then: (schema) => schema.required("A data de nascimento é obrigatória"),
    otherwise: (schema) => schema.notRequired(),
  }),
  nome_responsavel: yup.string().when("cargo", {
    is: "Aluno",
    then: (schema) => schema.required("O nome do responsável é obrigatório"),
    otherwise: (schema) => schema.notRequired(),
  }),
  telefone_responsavel: yup.string().when("cargo", {
    is: "Aluno",
    then: (schema) =>
      schema
        .required("O telefone do responsável é obrigatório")
        .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  usa_medicamento: yup.string().when("cargo", {
    is: "Aluno",
    then: (schema) =>
      schema
        .oneOf(["Sim", "Não"], "Informe se usa medicamento")
        .required("Informe se usa medicamento"),
    otherwise: (schema) => schema.notRequired(),
  }),
  info_medicamentos: yup.string().when(["cargo", "usa_medicamento"], {
    is: (cargo, usa_medicamento) =>
      cargo === "Aluno" && usa_medicamento === "Sim",
    then: (schema) => schema.required("Informe os medicamentos"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// 🔹 Empresas
export const empresasSchema = yup.object().shape({
  nome_fantasia: yup.string().required("O nome fantasia é obrigatório"),
  razao_social: yup.string().required("A razão social é obrigatória"),
  cnpj: yup
    .string()
    .required("O CNPJ é obrigatório")
    .matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "CNPJ inválido"),
  endereco: yup.string().required("O endereço é obrigatório"),
  telefone: yup
    .string()
    .required("O telefone é obrigatório")
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido"),
  contato_rh_nome: yup.string().required("O nome do contato do RH é obrigatório"),
  contato_rh_email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail do contato do RH é obrigatório"),
  status: yup
    .string()
    .oneOf(["Ativo", "Inativo"], "Status inválido")
    .required("O status é obrigatório"),
});

// 🔹 Funções
export const funcoesSchema = yup.object().shape({
  titulo: yup.string().required("O título é obrigatório"),
  descricao: yup.string().required("A descrição é obrigatória"),
  departamento: yup.string().required("O departamento é obrigatório"),
  nivel: yup.string().required("O nível é obrigatório"),
  status: yup
    .string()
    .oneOf(["Ativo", "Inativo"], "Status inválido")
    .required("O status é obrigatório"),
});

// 🔹 Avaliação
export const avaliacaoSchema = yup.object().shape({
  tipo: yup.string().required("O tipo de avaliação é obrigatório"),
  status: yup
    .string()
    .oneOf(["Ativo", "Inativo"], "Status inválido")
    .required("O status é obrigatório"),
});

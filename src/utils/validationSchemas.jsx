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
  cargo: yup.string().required("O cargo é obrigatório"),
  dataIngresso: yup
    .date()
    .typeError("Data inválida")
    .required("A data de ingresso é obrigatória"),
});

// 🔹 Empresas
export const empresasSchema = yup.object().shape({
  razaoSocial: yup.string().required("A razão social é obrigatória"),
  cnpj: yup
    .string()
    .required("O CNPJ é obrigatório")
    .matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "CNPJ inválido"),
  endereco: yup.string().required("O endereço é obrigatório"),
  telefone: yup
    .string()
    .required("O telefone é obrigatório")
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido"),
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
});

// 🔹 Funções
export const funcoesSchema = yup.object().shape({
  titulo: yup.string().required("O título é obrigatório"),
  descricao: yup.string().required("A descrição é obrigatória"),
  departamento: yup.string().required("O departamento é obrigatório"),
  nivel: yup.string().required("O nível é obrigatório"),
});

// 🔹 Avaliação
export const avaliacaoSchema = yup.object().shape({
  tipo: yup.string().required("O tipo de avaliação é obrigatório"),
  criterios: yup.string().required("Os critérios são obrigatórios"),
  periodo: yup.string().required("O período é obrigatório"),
  responsavel: yup.string().required("O responsável é obrigatório"),
});

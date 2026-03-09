import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cadastroData: {
    pessoas: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      cargo: '',
      dataIngresso: '',
      data_nascimento: '',
      nome_responsavel: '',
      telefone_responsavel: '',
      usa_medicamento: '',
      info_medicamentos: '',
      status: '',
    },
    empresas: {
      nome_fantasia: '',
      razao_social: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      contato_rh_nome: '',
      contato_rh_telefone: '',
      contato_rh_email: '',
      status: '',
    },
    funcoes: { titulo: '', descricao: '', departamento: '', nivel: '', status: '' },
    avaliacao: { itens: '', criterios: '', periodo: '', responsavel: '', status: '' },
  },
  registerData: {
    email: '',
    password: '',
  },
  loading: false,
  error: null,
};


export const cadastroSlice = createSlice({
  name: 'cadastro',
  initialState,
  reducers: {
    updateCadastroAbaData: (state, action) => {
      const { aba, data } = action.payload;
      state.cadastroData[aba] = { ...state.cadastroData[aba], ...data };
    },
    resetCadastroData: (state) => {
      state.cadastroData = initialState.cadastroData;
    },
    updateRegisterData: (state, action) => {
      state.registerData = { ...state.registerData, ...action.payload };
    },
    resetRegisterData: (state) => {
      state.registerData = initialState.registerData;
    },
    setCadastroLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCadastroError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  updateCadastroAbaData,
  resetCadastroData,
  updateRegisterData,
  resetRegisterData,
  setCadastroLoading,
  setCadastroError,
} = cadastroSlice.actions;

export default cadastroSlice.reducer;

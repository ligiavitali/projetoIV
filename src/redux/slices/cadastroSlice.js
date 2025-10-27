import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cadastroData: {
    pessoas: { nome: '', email: '', telefone: '', cargo: '', dataIngresso: '' },
    empresas: { razaoSocial: '', cnpj: '', endereco: '', telefone: '', email: '' },
    funcoes: { titulo: '', descricao: '', departamento: '', nivel: '' },
    avaliacao: { tipo: '', criterios: '', periodo: '', responsavel: '' },
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

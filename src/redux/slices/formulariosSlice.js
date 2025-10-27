import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Estado para Ficha de Acompanhamento
  fichaAcompanhamento: {},
  // Estado para Formulário de Avaliação
  formularioAvaliacao: {},
  // Estado para Avaliação de Experiência 1
  avaliacaoExperiencia1: {},
  // Estado para Avaliação de Experiência 2
  avaliacaoExperiencia2: {},
  loading: false,
  error: null,
};

export const formulariosSlice = createSlice({
  name: 'formularios',
  initialState,
  reducers: {
    updateFichaAcompanhamento: (state, action) => {
      state.fichaAcompanhamento = { ...state.fichaAcompanhamento, ...action.payload };
    },
    updateFormularioAvaliacao: (state, action) => {
      state.formularioAvaliacao = { ...state.formularioAvaliacao, ...action.payload };
    },
    updateAvaliacaoExperiencia1: (state, action) => {
      state.avaliacaoExperiencia1 = { ...state.avaliacaoExperiencia1, ...action.payload };
    },
    updateAvaliacaoExperiencia2: (state, action) => {
      state.avaliacaoExperiencia2 = { ...state.avaliacaoExperiencia2, ...action.payload };
    },
    resetFormulariosData: (state) => {
      state.fichaAcompanhamento = initialState.fichaAcompanhamento;
      state.formularioAvaliacao = initialState.formularioAvaliacao;
      state.avaliacaoExperiencia1 = initialState.avaliacaoExperiencia1;
      state.avaliacaoExperiencia2 = initialState.avaliacaoExperiencia2;
    },
    setFormulariosLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFormulariosError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  updateFichaAcompanhamento,
  updateFormularioAvaliacao,
  updateAvaliacaoExperiencia1,
  updateAvaliacaoExperiencia2,
  resetFormulariosData,
  setFormulariosLoading,
  setFormulariosError,
} = formulariosSlice.actions;

export default formulariosSlice.reducer;

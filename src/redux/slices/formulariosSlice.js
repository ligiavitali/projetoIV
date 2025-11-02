import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

// ===================== THUNKS ASSÍNCRONOS =====================

// Helper genérico para criar thunks
const createCRUDThunks = (nome, endpoint) => {
  const fetchList = createAsyncThunk(
    `formularios/fetch${nome}List`,
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  const saveItem = createAsyncThunk(
    `formularios/save${nome}`,
    async (data, { rejectWithValue }) => {
      try {
        const metodo = data.id ? "PUT" : "POST";
        const url = data.id
          ? `${API_URL}/${endpoint}/${data.id}`
          : `${API_URL}/${endpoint}`;
        const response = await axios({ method: metodo, url, data });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  const deleteItem = createAsyncThunk(
    `formularios/delete${nome}`,
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`${API_URL}/${endpoint}/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  return { fetchList, saveItem, deleteItem };
};

// ===================== CRIAÇÃO DOS THUNKS =====================
export const {
  fetchList: fetchControleInternoList,
  saveItem: saveControleInterno,
  deleteItem: deleteControleInterno,
} = createCRUDThunks("ControleInterno", "controleInterno");

export const {
  fetchList: fetchAvaliacaoExperiencia1List,
  saveItem: saveAvaliacaoExperiencia1,
  deleteItem: deleteAvaliacaoExperiencia1,
} = createCRUDThunks("AvaliacaoExperiencia1", "avaliacaoExperiencia1");

export const {
  fetchList: fetchAvaliacaoExperiencia2List,
  saveItem: saveAvaliacaoExperiencia2,
  deleteItem: deleteAvaliacaoExperiencia2,
} = createCRUDThunks("AvaliacaoExperiencia2", "avaliacaoExperiencia2");

export const {
  fetchList: fetchFichaAcompanhamentoList,
  saveItem: saveFichaAcompanhamento,
  deleteItem: deleteFichaAcompanhamento,
} = createCRUDThunks("FichaAcompanhamento", "fichaAcompanhamento");

export const {
  fetchList: fetchListaUsuariosEncaminhadosList,
  saveItem: saveListaUsuariosEncaminhados,
  deleteItem: deleteListaUsuariosEncaminhados,
} = createCRUDThunks("ListaUsuariosEncaminhados", "listaUsuariosEncaminhados");

// ===================== ESTADO INICIAL =====================
const initialState = {
  fichaAcompanhamento: {},
  formularioAvaliacao: {},
  avaliacaoExperiencia1: {},
  avaliacaoExperiencia2: {},
  listaUsuariosEncaminhados: {
    anoReferencia: "2025",
    usuarios: [
      {
        id: 1,
        numero: "01",
        nome: "",
        dataAdmissao: "",
        empresa: "",
        funcao: "",
        contatoRH: "",
        provavelDataDesligamento: "",
      },
    ],
  },
  controleInternoList: [],
  avaliacaoExperiencia1List: [],
  avaliacaoExperiencia2List: [],
  fichaAcompanhamentoList: [],
  listaUsuariosEncaminhadosList: [],
  loading: false,
  error: null,
};

// ===================== SLICE PRINCIPAL =====================
export const formulariosSlice = createSlice({
  name: "formularios",
  initialState,
  reducers: {
    updateFichaAcompanhamento: (state, action) => {
      state.fichaAcompanhamento = {
        ...state.fichaAcompanhamento,
        ...action.payload,
      };
    },
    updateFormularioAvaliacao: (state, action) => {
      state.formularioAvaliacao = {
        ...state.formularioAvaliacao,
        ...action.payload,
      };
    },
    updateAvaliacaoExperiencia1: (state, action) => {
      state.avaliacaoExperiencia1 = {
        ...state.avaliacaoExperiencia1,
        ...action.payload,
      };
    },
    updateAvaliacaoExperiencia2: (state, action) => {
      state.avaliacaoExperiencia2 = {
        ...state.avaliacaoExperiencia2,
        ...action.payload,
      };
    },
    updateListaUsuariosEncaminhados: (state, action) => {
      state.listaUsuariosEncaminhados = {
        ...state.listaUsuariosEncaminhados,
        ...action.payload,
      };
    },
    resetFormulariosData: (state) => {
      Object.assign(state, initialState);
    },
    setFormulariosLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFormulariosError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    const handleAsync = (fetchThunk, saveThunk, deleteThunk, key) => {
      builder
        // FETCH
        .addCase(fetchThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          state.loading = false;
          state[key] = action.payload;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // SAVE
        .addCase(saveThunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(saveThunk.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(saveThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // DELETE
        .addCase(deleteThunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteThunk.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(deleteThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    handleAsync(fetchControleInternoList, saveControleInterno, deleteControleInterno, "controleInternoList");
    handleAsync(fetchAvaliacaoExperiencia1List, saveAvaliacaoExperiencia1, deleteAvaliacaoExperiencia1, "avaliacaoExperiencia1List");
    handleAsync(fetchAvaliacaoExperiencia2List, saveAvaliacaoExperiencia2, deleteAvaliacaoExperiencia2, "avaliacaoExperiencia2List");
    handleAsync(fetchFichaAcompanhamentoList, saveFichaAcompanhamento, deleteFichaAcompanhamento, "fichaAcompanhamentoList");
    handleAsync(fetchListaUsuariosEncaminhadosList, saveListaUsuariosEncaminhados, deleteListaUsuariosEncaminhados, "listaUsuariosEncaminhadosList");
  },
});

// ===================== EXPORTAÇÕES =====================
export const {
  updateFichaAcompanhamento,
  updateFormularioAvaliacao,
  updateAvaliacaoExperiencia1,
  updateAvaliacaoExperiencia2,
  updateListaUsuariosEncaminhados,
  resetFormulariosData,
  setFormulariosLoading,
  setFormulariosError,
} = formulariosSlice.actions;

export default formulariosSlice.reducer;

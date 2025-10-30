import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// ===================== THUNKS ASSÍNCRONOS =====================

// 1. Controle Interno / Formulário Avaliação
export const fetchControleInternoList = createAsyncThunk(
  'formularios/fetchControleInternoList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/controleInterno`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveControleInterno = createAsyncThunk(
  'formularios/saveControleInterno',
  async (data, { rejectWithValue }) => {
    try {
      const metodo = data.id ? 'PUT' : 'POST';
      const endpoint = data.id
        ? `${API_URL}/controleInterno/${data.id}`
        : `${API_URL}/controleInterno`;

      const response = await axios({
        method: metodo,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteControleInterno = createAsyncThunk(
  'formularios/deleteControleInterno',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/controleInterno/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Avaliação Experiência 1
export const fetchAvaliacaoExperiencia1List = createAsyncThunk(
  'formularios/fetchAvaliacaoExperiencia1List',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/avaliacaoExperiencia1`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveAvaliacaoExperiencia1 = createAsyncThunk(
  'formularios/saveAvaliacaoExperiencia1',
  async (data, { rejectWithValue }) => {
    try {
      const metodo = data.id ? 'PUT' : 'POST';
      const endpoint = data.id
        ? `${API_URL}/avaliacaoExperiencia1/${data.id}`
        : `${API_URL}/avaliacaoExperiencia1`;

      const response = await axios({
        method: metodo,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAvaliacaoExperiencia1 = createAsyncThunk(
  'formularios/deleteAvaliacaoExperiencia1',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/avaliacaoExperiencia1/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Avaliação Experiência 2
export const fetchAvaliacaoExperiencia2List = createAsyncThunk(
  'formularios/fetchAvaliacaoExperiencia2List',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/avaliacaoExperiencia2`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveAvaliacaoExperiencia2 = createAsyncThunk(
  'formularios/saveAvaliacaoExperiencia2',
  async (data, { rejectWithValue }) => {
    try {
      const metodo = data.id ? 'PUT' : 'POST';
      const endpoint = data.id
        ? `${API_URL}/avaliacaoExperiencia2/${data.id}`
        : `${API_URL}/avaliacaoExperiencia2`;

      const response = await axios({
        method: metodo,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAvaliacaoExperiencia2 = createAsyncThunk(
  'formularios/deleteAvaliacaoExperiencia2',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/avaliacaoExperiencia2/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. Ficha de Acompanhamento
export const fetchFichaAcompanhamentoList = createAsyncThunk(
  'formularios/fetchFichaAcompanhamentoList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/fichaAcompanhamento`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveFichaAcompanhamento = createAsyncThunk(
  'formularios/saveFichaAcompanhamento',
  async (data, { rejectWithValue }) => {
    try {
      const metodo = data.id ? 'PUT' : 'POST';
      const endpoint = data.id
        ? `${API_URL}/fichaAcompanhamento/${data.id}`
        : `${API_URL}/fichaAcompanhamento`;

      const response = await axios({
        method: metodo,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFichaAcompanhamento = createAsyncThunk(
  'formularios/deleteFichaAcompanhamento',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/fichaAcompanhamento/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 5. Lista de Usuários Encaminhados
export const fetchListaUsuariosEncaminhadosList = createAsyncThunk(
  'formularios/fetchListaUsuariosEncaminhadosList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/listaUsuariosEncaminhados`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveListaUsuariosEncaminhados = createAsyncThunk(
  'formularios/saveListaUsuariosEncaminhados',
  async (data, { rejectWithValue }) => {
    try {
      const metodo = data.id ? 'PUT' : 'POST';
      const endpoint = data.id
        ? `${API_URL}/listaUsuariosEncaminhados/${data.id}`
        : `${API_URL}/listaUsuariosEncaminhados`;

      const response = await axios({
        method: metodo,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteListaUsuariosEncaminhados = createAsyncThunk(
  'formularios/deleteListaUsuariosEncaminhados',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/listaUsuariosEncaminhados/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===================== ESTADO INICIAL =====================
const initialState = {
  fichaAcompanhamento: {},
  formularioAvaliacao: {},
  avaliacaoExperiencia1: {},
  avaliacaoExperiencia2: {},
  listaUsuariosEncaminhados: {
    anoReferencia: '2025',
    usuarios: [
      {
        id: 1,
        numero: '01',
        nome: '',
        dataAdmissao: '',
        empresa: '',
        funcao: '',
        contatoRH: '',
        provavelDataDesligamento: '',
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
    updateListaUsuariosEncaminhados: (state, action) => {
      state.listaUsuariosEncaminhados = { ...state.listaUsuariosEncaminhados, ...action.payload };
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
	    // Helper para lidar com os casos de fetch, save e delete
	    const handleListAsync = (fetchListThunk, saveThunk, deleteThunk, listStateName) => {
	      builder
	        // FETCH LIST
	        .addCase(fetchListThunk.pending, (state) => {
	          state.loading = true;
	          state.error = null;
	        })
	        .addCase(fetchListThunk.fulfilled, (state, action) => {
	          state.loading = false;
	          state[listStateName] = action.payload;
	        })
	        .addCase(fetchListThunk.rejected, (state, action) => {
	          state.loading = false;
	          state.error = action.payload;
	        })
	        // SAVE ITEM
	        .addCase(saveThunk.pending, (state) => {
	          state.loading = true;
	          state.error = null;
	        })
	        .addCase(saveThunk.fulfilled, (state, action) => {
	          state.loading = false;
	          // A lista é recarregada no componente após o save, então não precisamos atualizar aqui.
	        })
	        .addCase(saveThunk.rejected, (state, action) => {
	          state.loading = false;
	          state.error = action.payload;
	        })
	        // DELETE ITEM
	        .addCase(deleteThunk.pending, (state) => {
	          state.loading = true;
	          state.error = null;
	        })
	        .addCase(deleteThunk.fulfilled, (state, action) => {
	          state.loading = false;
	          // A lista é recarregada no componente após o delete, então não precisamos atualizar aqui.
	        })
	        .addCase(deleteThunk.rejected, (state, action) => {
	          state.loading = false;
	          state.error = action.payload;
	        });
	    };
	
	    // Aplica a lógica para cada formulário
	    handleListAsync(fetchControleInternoList, saveControleInterno, deleteControleInterno, 'controleInternoList');
	    handleListAsync(fetchAvaliacaoExperiencia1List, saveAvaliacaoExperiencia1, deleteAvaliacaoExperiencia1, 'avaliacaoExperiencia1List');
	    handleListAsync(fetchAvaliacaoExperiencia2List, saveAvaliacaoExperiencia2, deleteAvaliacaoExperiencia2, 'avaliacaoExperiencia2List');
	    handleListAsync(fetchFichaAcompanhamentoList, saveFichaAcompanhamento, deleteFichaAcompanhamento, 'fichaAcompanhamentoList');
	    handleListAsync(fetchListaUsuariosEncaminhadosList, saveListaUsuariosEncaminhados, deleteListaUsuariosEncaminhados, 'listaUsuariosEncaminhadosList');
	
	  },
});

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

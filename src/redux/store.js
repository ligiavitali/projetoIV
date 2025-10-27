import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cadastroReducer from './slices/cadastroSlice';
import formulariosReducer from './slices/formulariosSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cadastro: cadastroReducer,
    formularios: formulariosReducer,
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cadastroReducer from './slices/cadastroSlice';
import formulariosReducer from './slices/formulariosSlice';

const AUTH_SESSION_KEY = 'authSession';
const SESSION_DURATION_MS = 60 * 60 * 1000;

const loadPersistedUserState = () => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw);
    const expiresAt = Number(parsed?.sessionExpiresAt || 0);

    if (!parsed?.user || !expiresAt || Date.now() >= expiresAt) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return undefined;
    }

    return {
      user: {
        isAuthenticated: true,
        user: parsed.user,
        sessionExpiresAt: expiresAt,
        loading: false,
        error: null,
      },
    };
  } catch (_error) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    cadastro: cadastroReducer,
    formularios: formulariosReducer,
  },
  preloadedState: loadPersistedUserState(),
});

store.subscribe(() => {
  const state = store.getState();
  const userState = state.user;

  if (!userState?.isAuthenticated || !userState?.user || !userState?.sessionExpiresAt) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  const expiresAt = Number(userState.sessionExpiresAt);
  if (!expiresAt || Date.now() >= expiresAt) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      user: userState.user,
      sessionExpiresAt: expiresAt,
      durationMs: SESSION_DURATION_MS,
    })
  );
});

export default store;

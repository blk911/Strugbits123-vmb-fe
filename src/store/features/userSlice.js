import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

const loadInitialState = () => {
  if (typeof window === "undefined") {
    return {
      data: null,
      loading: true,
      token: null,
    };
  }

  try {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_DATA_KEY);

    return {
      data: storedUser ? JSON.parse(storedUser) : null,
      loading: false,
      token: storedToken || null,
    };
  } catch (error) {
    console.warn("Failed to load user data from localStorage:", error);
    return {
      data: null,
      loading: false,
      token: null,
    };
  }
};

const initialState = loadInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
      state.loading = false;

      if (action.payload) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(USER_DATA_KEY);
      }
    },

    clearUser(state) {
      state.data = null;
      state.loading = false;
      localStorage.removeItem(USER_DATA_KEY);
    },

    setToken(state, action) {
      state.token = action.payload;

      if (action.payload) {
        localStorage.setItem(TOKEN_KEY, action.payload);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    },

    clearToken(state) {
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },

    logout(state) {
      state.data = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    },
  },
});

export const { setUser, clearUser, setToken, clearToken, logout } =
  userSlice.actions;

export default userSlice.reducer;

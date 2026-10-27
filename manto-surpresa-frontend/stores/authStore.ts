import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const COOKIE_NAME = "auth_token";

export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    // 7 dias de validade (604800 segundos), acessível em todo o domínio
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function removeAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,

      setAuth: (token: string, email: string) => {
        setAuthCookie(token);
        set({ token, email });
      },

      logout: () => {
        removeAuthCookie();
        set({ token: null, email: null });
      },

      isAuthenticated: () => {
        return Boolean(get().token);
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthCookie(state.token);
        }
      },
    }
  )
);

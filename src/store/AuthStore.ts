import { apiInstance } from "@config/_axios/AxiosConfig";
import { JwtTokenUser } from "@interfaces/response/common";
import { decodeJwtPayload } from "@utils/JwtDecoder";
import {create} from "zustand"



export interface AuthState {
  token: string | null;
  isUserVerifyed: boolean;
  isUserLoggedIn: boolean;
  user: JwtTokenUser | null
  setToken: (token: string) => void;
  removeToken: () => void;
  setIsUserVerifyed: (isUserVerifyed: boolean) => void;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
  setUser: (user: JwtTokenUser | null) => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isUserVerifyed: false,
  isUserLoggedIn: false,
  payloadInfo: null,
  user: null,
  setToken: (token) => set({ token }),
  removeToken: () => set({ token: null }),
  setIsUserVerifyed: (isUserVerifyed) => set({ isUserVerifyed }),
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  setUser: (user: JwtTokenUser | null) => set({ user }),
}));


export function storeInfo(): AuthState {
  return useAuthStore((state) => state)
}

export function setToken(token: string) {
  useAuthStore.getState().setToken(token),
    useAuthStore.getState().setIsUserLoggedIn(true)
  useAuthStore.getState().setUser(decodeJwtPayload(token))
  apiInstance.defaults.headers.common["accessToken"] = token
}
export function removeToken() {
  useAuthStore.getState().removeToken(),
    useAuthStore.getState().setIsUserVerifyed(false),
    useAuthStore.getState().setIsUserLoggedIn(false),
    useAuthStore.getState().setUser(null);
  apiInstance.defaults.headers.common["accessToken"] = ""
}

export function setPayload(payloadInfo: JwtTokenUser | null) {
  useAuthStore.getState().setUser(payloadInfo)
}

export function isUserLoggedIn() {
  return useAuthStore((state) => state.isUserLoggedIn)
}

export function setUserInfo(user: JwtTokenUser) {
  useAuthStore.getState().setUser(user)
}

export default useAuthStore;
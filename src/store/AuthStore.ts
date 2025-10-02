import { JwtTokenUser } from "@interfaces/response/common";
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

const useAuthStore = create<AuthState>((set)=>({
    
}))

export default useAuthStore;
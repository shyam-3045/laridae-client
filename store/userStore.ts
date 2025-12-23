import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Data={
  user:string
}
interface UserState {
  isLogged: boolean
  data:Data
  login: (data:Data) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      isLogged: false,
      data:{
        user:""
      },
      

      login: (data:Data) => {
        set({
          isLogged: true,
          data:data
          
        });
      },

    

      logout: () => {
        set({
          isLogged: false
          
        });
      },

      checkAuth: () => {
        return get().isLogged;
      },
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
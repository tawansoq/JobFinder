import { createContext, useContext, useState } from 'react';
import { read, save } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('jobfinder_user', null));
  const login = (u) => { setUser(u); save('jobfinder_user', u); };
  const logout = () => { setUser(null); localStorage.removeItem('jobfinder_user'); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const homeForRole = role => role === 'company' ? '/company' : role === 'recruiter' ? '/recruiter' : '/jobs';
export const roleLabel = role => role === 'company' ? 'บริษัท' : role === 'recruiter' ? 'Recruiter / ผู้สรรหา' : 'ผู้สมัครงาน';
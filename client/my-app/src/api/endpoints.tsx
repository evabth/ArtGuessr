const API_BASE = import.meta.env.VITE_API_URL;

export const API = {
  game:{
    nextArtwork: `${API_BASE}/game/random`,
    guess: `${API_BASE}/game/guess`

  },
  users:{
    login: `${API_BASE}/users/login`,
    register: `${API_BASE}/users/register`,
    currentUser: `${API_BASE}/users/current`,

  }
  
  
};
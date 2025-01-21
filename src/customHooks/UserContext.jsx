import { createContext, useReducer, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function fetchUser(dispatch) {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;

      async function fetchUser(userId) {
        console.log("Fetching user...");
        const response = await fetch('http://localhost:5000/getUser', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const data = await response.json();
        console.log('Fetched user data:', data.user);
        if(data.user){
          dispatch({
            type: 'login',
            user: data.user,
          });
        }
        else{
          dispatch({
            type: 'logout',
          });
        }
      }

      fetchUser(userId);
      
    }
  });

  return () => unsubscribe();
}

const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [User, dispatch] = useReducer(UserReducer, loadInitialUser());

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(User));
  }, [User]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(dispatch);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={User}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}

export function useUserDispatchContext() {
  return useContext(UserDispatchContext);
}

function UserReducer(user, action) {
  switch (action.type) {
    case 'login': {
      return {
        ...action.user,
      };
    }
    case 'logout': {
      localStorage.setItem('user', JSON.stringify(initialUser));
      return initialUser;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function loadInitialUser() {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : initialUser;
}

const initialUser = {
  name: '',
  userId: '',
  email: '',
  photoURL: '',
  college: '',
  isAdvertiser: false,
  isDeveloper: false,
  appliedForms: [],
  madeAds: [],
  madeNews: [],
};

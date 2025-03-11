import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '../../../../shared/types/user';
import { mockUser } from '../mockData';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: mockUser,
  loading: false,
  error: null,
  isAuthenticated: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set current user
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    
    // Update user preferences
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
      }
    },
    
    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<Omit<User, 'id' | 'preferences'>>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    
    // Log out user
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentUser,
  updateUserPreferences,
  updateUserProfile,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
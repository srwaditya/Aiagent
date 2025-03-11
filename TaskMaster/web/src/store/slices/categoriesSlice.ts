import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../../../shared/types/task';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [
    { id: 'work', name: 'Work', color: '#4361ee', icon: 'briefcase' },
    { id: 'personal', name: 'Personal', color: '#3f37c9', icon: 'user' },
    { id: 'shopping', name: 'Shopping', color: '#f72585', icon: 'shopping-cart' },
    { id: 'health', name: 'Health', color: '#4caf50', icon: 'heart' },
    { id: 'education', name: 'Education', color: '#ff9800', icon: 'book' },
  ],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
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
    
    // Add a new category
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const id = action.payload.name.toLowerCase().replace(/\s+/g, '-');
      
      // Check if category with this ID already exists
      if (state.categories.some(category => category.id === id)) {
        state.error = 'A category with this name already exists';
        return;
      }
      
      const newCategory: Category = {
        ...action.payload,
        id,
      };
      
      state.categories.push(newCategory);
    },
    
    // Update an existing category
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Category, 'id'>> }>) => {
      const { id, updates } = action.payload;
      const categoryIndex = state.categories.findIndex(category => category.id === id);
      
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = {
          ...state.categories[categoryIndex],
          ...updates,
        };
      }
    },
    
    // Delete a category
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
    
    // Set all categories (used for loading from storage)
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addCategory,
  updateCategory,
  deleteCategory,
  setCategories,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
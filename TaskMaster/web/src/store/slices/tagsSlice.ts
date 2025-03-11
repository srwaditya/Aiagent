import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../../../shared/types/task';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [
    { id: 'urgent', name: 'Urgent', color: '#f44336' },
    { id: 'important', name: 'Important', color: '#ff9800' },
    { id: 'meeting', name: 'Meeting', color: '#4361ee' },
    { id: 'idea', name: 'Idea', color: '#4caf50' },
    { id: 'review', name: 'Review', color: '#3f37c9' },
  ],
  loading: false,
  error: null,
};

const tagsSlice = createSlice({
  name: 'tags',
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
    
    // Add a new tag
    addTag: (state, action: PayloadAction<Omit<Tag, 'id'>>) => {
      const id = action.payload.name.toLowerCase().replace(/\s+/g, '-');
      
      // Check if tag with this ID already exists
      if (state.tags.some(tag => tag.id === id)) {
        state.error = 'A tag with this name already exists';
        return;
      }
      
      const newTag: Tag = {
        ...action.payload,
        id,
      };
      
      state.tags.push(newTag);
    },
    
    // Update an existing tag
    updateTag: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Tag, 'id'>> }>) => {
      const { id, updates } = action.payload;
      const tagIndex = state.tags.findIndex(tag => tag.id === id);
      
      if (tagIndex !== -1) {
        state.tags[tagIndex] = {
          ...state.tags[tagIndex],
          ...updates,
        };
      }
    },
    
    // Delete a tag
    deleteTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload);
    },
    
    // Set all tags (used for loading from storage)
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addTag,
  updateTag,
  deleteTag,
  setTags,
} = tagsSlice.actions;

export default tagsSlice.reducer;
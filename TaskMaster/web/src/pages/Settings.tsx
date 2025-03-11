import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../shared/constants/colors';

// Import icons
import { 
  FiSun, 
  FiMoon, 
  FiMonitor,
  FiSave,
  FiTrash2,
  FiPlus,
  FiEdit,
  FiX
} from 'react-icons/fi';

// Import from Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateUserPreferences } from '../store/slices/userSlice';
import { addCategory, updateCategory, deleteCategory } from '../store/slices/categoriesSlice';
import { addTag, updateTag, deleteTag } from '../store/slices/tagsSlice';

const Settings: React.FC = () => {
  const { theme, themeType, setThemeType } = useTheme();
  const dispatch = useDispatch();
  
  const userPreferences = useSelector((state: RootState) => 
    state.user.currentUser?.preferences || {
      theme: 'system',
      defaultView: 'list',
      defaultTaskSort: 'dueDate',
      defaultTaskSortDirection: 'asc',
      emailNotifications: true,
      pushNotifications: true,
      reminderTime: 30
    }
  );
  
  const categories = useSelector((state: RootState) => state.categories.categories);
  const tags = useSelector((state: RootState) => state.tags.tags);
  
  // State for form values
  const [preferences, setPreferences] = useState(userPreferences);
  
  // State for category and tag editing
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(COLORS.primary);
  
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(COLORS.primary);
  
  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setPreferences({
      ...preferences,
      theme: newTheme
    });
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeType(systemTheme);
    } else {
      setThemeType(newTheme === 'dark' ? 'dark' : 'light');
    }
  };
  
  // Handle preferences save
  const handleSavePreferences = () => {
    dispatch(updateUserPreferences(preferences));
    alert('Preferences saved successfully!');
  };
  
  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    dispatch(addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: 'folder'
    }));
    
    setNewCategoryName('');
    setNewCategoryColor(COLORS.primary);
  };
  
  // Handle updating a category
  const handleUpdateCategory = (id: string) => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    dispatch(updateCategory({
      id,
      updates: {
        name: newCategoryName.trim(),
        color: newCategoryColor
      }
    }));
    
    setEditingCategoryId(null);
    setNewCategoryName('');
    setNewCategoryColor(COLORS.primary);
  };
  
  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };
  
  // Handle editing a category
  const handleEditCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setNewCategoryName(category.name);
      setNewCategoryColor(category.color);
      setEditingCategoryId(id);
    }
  };
  
  // Handle adding a new tag
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }
    
    dispatch(addTag({
      name: newTagName.trim(),
      color: newTagColor
    }));
    
    setNewTagName('');
    setNewTagColor(COLORS.primary);
  };
  
  // Handle updating a tag
  const handleUpdateTag = (id: string) => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }
    
    dispatch(updateTag({
      id,
      updates: {
        name: newTagName.trim(),
        color: newTagColor
      }
    }));
    
    setEditingTagId(null);
    setNewTagName('');
    setNewTagColor(COLORS.primary);
  };
  
  // Handle deleting a tag
  const handleDeleteTag = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      dispatch(deleteTag(id));
    }
  };
  
  // Handle editing a tag
  const handleEditTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (tag) {
      setNewTagName(tag.name);
      setNewTagColor(tag.color);
      setEditingTagId(id);
    }
  };
  
  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Settings</SettingsTitle>
        <SaveButton onClick={handleSavePreferences}>
          <FiSave />
          <span>Save Preferences</span>
        </SaveButton>
      </SettingsHeader>
      
      <SettingsContent>
        <SettingsSection>
          <SettingsSectionTitle>Appearance</SettingsSectionTitle>
          <SettingGroup>
            <SettingLabel>Theme</SettingLabel>
            <ThemeOptions>
              <ThemeOption 
                $isSelected={preferences.theme === 'light'}
                onClick={() => handleThemeChange('light')}
                theme={theme}
              >
                <FiSun />
                <span>Light</span>
              </ThemeOption>
              
              <ThemeOption 
                $isSelected={preferences.theme === 'dark'}
                onClick={() => handleThemeChange('dark')}
                theme={theme}
              >
                <FiMoon />
                <span>Dark</span>
              </ThemeOption>
              
              <ThemeOption 
                $isSelected={preferences.theme === 'system'}
                onClick={() => handleThemeChange('system')}
                theme={theme}
              >
                <FiMonitor />
                <span>System</span>
              </ThemeOption>
            </ThemeOptions>
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Default View</SettingLabel>
            <Select 
              value={preferences.defaultView}
              onChange={(e) => setPreferences({
                ...preferences,
                defaultView: e.target.value as 'list' | 'board' | 'calendar'
              })}
              theme={theme}
            >
              <option value="list">List</option>
              <option value="board">Board</option>
              <option value="calendar">Calendar</option>
            </Select>
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Default Task Sort</SettingLabel>
            <Select 
              value={preferences.defaultTaskSort}
              onChange={(e) => setPreferences({
                ...preferences,
                defaultTaskSort: e.target.value as 'dueDate' | 'priority' | 'createdAt' | 'title'
              })}
              theme={theme}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </Select>
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Sort Direction</SettingLabel>
            <Select 
              value={preferences.defaultTaskSortDirection}
              onChange={(e) => setPreferences({
                ...preferences,
                defaultTaskSortDirection: e.target.value as 'asc' | 'desc'
              })}
              theme={theme}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </SettingGroup>
        </SettingsSection>
        
        <SettingsSection>
          <SettingsSectionTitle>Notifications</SettingsSectionTitle>
          <SettingGroup>
            <SettingLabel>Email Notifications</SettingLabel>
            <Toggle 
              $isActive={preferences.emailNotifications}
              onClick={() => setPreferences({
                ...preferences,
                emailNotifications: !preferences.emailNotifications
              })}
            />
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Push Notifications</SettingLabel>
            <Toggle 
              $isActive={preferences.pushNotifications}
              onClick={() => setPreferences({
                ...preferences,
                pushNotifications: !preferences.pushNotifications
              })}
            />
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Reminder Time (minutes before due date)</SettingLabel>
            <Select 
              value={preferences.reminderTime.toString()}
              onChange={(e) => setPreferences({
                ...preferences,
                reminderTime: parseInt(e.target.value)
              })}
              theme={theme}
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="1440">1 day</option>
            </Select>
          </SettingGroup>
        </SettingsSection>
        
        <SettingsSection>
          <SettingsSectionTitle>Categories</SettingsSectionTitle>
          
          <CategoryList>
            {categories.map(category => (
              <CategoryItem key={category.id} theme={theme}>
                {editingCategoryId === category.id ? (
                  <CategoryEditForm>
                    <Input 
                      type="text" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      theme={theme}
                    />
                    <ColorInput 
                      type="color" 
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                    />
                    <SaveItemButton onClick={() => handleUpdateCategory(category.id)}>
                      <FiSave />
                    </SaveItemButton>
                    <CancelEditButton onClick={() => setEditingCategoryId(null)}>
                      <FiX />
                    </CancelEditButton>
                  </CategoryEditForm>
                ) : (
                  <>
                    <CategoryColor color={category.color} />
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryActions>
                      <EditItemButton onClick={() => handleEditCategory(category.id)}>
                        <FiEdit />
                      </EditItemButton>
                      <DeleteItemButton onClick={() => handleDeleteCategory(category.id)}>
                        <FiTrash2 />
                      </DeleteItemButton>
                    </CategoryActions>
                  </>
                )}
              </CategoryItem>
            ))}
          </CategoryList>
          
          <AddItemForm>
            <Input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              theme={theme}
            />
            <ColorInput 
              type="color" 
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
            />
            <AddItemButton onClick={handleAddCategory}>
              <FiPlus />
              <span>Add Category</span>
            </AddItemButton>
          </AddItemForm>
        </SettingsSection>
        
        <SettingsSection>
          <SettingsSectionTitle>Tags</SettingsSectionTitle>
          
          <TagList>
            {tags.map(tag => (
              <TagItem key={tag.id} theme={theme}>
                {editingTagId === tag.id ? (
                  <TagEditForm>
                    <Input 
                      type="text" 
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Tag name"
                      theme={theme}
                    />
                    <ColorInput 
                      type="color" 
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                    />
                    <SaveItemButton onClick={() => handleUpdateTag(tag.id)}>
                      <FiSave />
                    </SaveItemButton>
                    <CancelEditButton onClick={() => setEditingTagId(null)}>
                      <FiX />
                    </CancelEditButton>
                  </TagEditForm>
                ) : (
                  <>
                    <TagBadge color={tag.color}>{tag.name}</TagBadge>
                    <TagActions>
                      <EditItemButton onClick={() => handleEditTag(tag.id)}>
                        <FiEdit />
                      </EditItemButton>
                      <DeleteItemButton onClick={() => handleDeleteTag(tag.id)}>
                        <FiTrash2 />
                      </DeleteItemButton>
                    </TagActions>
                  </>
                )}
              </TagItem>
            ))}
          </TagList>
          
          <AddItemForm>
            <Input 
              type="text" 
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag name"
              theme={theme}
            />
            <ColorInput 
              type="color" 
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
            />
            <AddItemButton onClick={handleAddTag}>
              <FiPlus />
              <span>Add Tag</span>
            </AddItemButton>
          </AddItemForm>
        </SettingsSection>
      </SettingsContent>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SettingsTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${COLORS.primaryDark};
  }
`;

const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SettingsSection = styled.section`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  padding: 24px;
`;

const SettingsSectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SettingGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ThemeOptions = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

interface ThemeOptionProps {
  $isSelected: boolean;
  theme: any;
}

const ThemeOption = styled.button<ThemeOptionProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${props => props.$isSelected ? `${COLORS.primary}20` : props.theme.background};
  color: ${props => props.$isSelected ? COLORS.primary : props.theme.text};
  border: 1px solid ${props => props.$isSelected ? COLORS.primary : props.theme.border};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isSelected ? `${COLORS.primary}30` : props.theme.divider};
  }
`;

const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}40;
  }
`;

interface ToggleProps {
  $isActive: boolean;
}

const Toggle = styled.button<ToggleProps>`
  position: relative;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: ${props => props.$isActive ? COLORS.primary : props.theme.border};
  border: none;
  transition: all 0.2s;
  
  &:before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.$isActive ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.2s;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
`;

const CategoryColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 12px;
`;

const CategoryName = styled.span`
  flex: 1;
  font-size: 0.9rem;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EditItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  color: ${props => props.theme.textSecondary};
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.divider};
    color: ${props => props.theme.text};
  }
`;

const DeleteItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  color: ${COLORS.error};
  border: none;
  
  &:hover {
    background-color: ${COLORS.error}10;
  }
`;

const CategoryEditForm = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}40;
  }
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const SaveItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  color: ${COLORS.success};
  border: none;
  
  &:hover {
    background-color: ${COLORS.success}10;
  }
`;

const CancelEditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  color: ${COLORS.error};
  border: none;
  
  &:hover {
    background-color: ${COLORS.error}10;
  }
`;

const AddItemForm = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${COLORS.primary}20;
  color: ${COLORS.primary};
  border: 1px solid ${COLORS.primary};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${COLORS.primary}30;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
`;

const TagBadge = styled.span<{ color: string }>`
  flex: 1;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
`;

const TagActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TagEditForm = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export default Settings;
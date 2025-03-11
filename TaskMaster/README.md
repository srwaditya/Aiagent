# TaskMaster - Task Management Application

TaskMaster is a modern task management application built with React and TypeScript, designed to work seamlessly on both web and mobile platforms.

## Features

- Create, edit, and delete tasks
- Organize tasks with categories and tags
- Set due dates and priorities
- Track task progress
- Filter and search tasks
- User authentication
- Dark/Light theme support
- Responsive design for web and mobile
- Offline support with data synchronization

## Tech Stack

- React.js
- TypeScript
- React Native (for mobile)
- Redux for state management
- Styled Components for styling
- Firebase for backend services (optional)

## Running the Web Application

To run the web application:

1. Navigate to the web directory:
   ```bash
   cd TaskMaster/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Bug Fixes

If you encounter the following error:

```
ERROR in src/styles/GlobalStyle.ts:69:14
TS2367: This comparison appears to be unintentional because the types '{ background: string; surface: string; text: string; textSecondary: string; border: string; divider: string; } | { background: string; surface: string; text: string; textSecondary: string; border: string; divider: string; }' and 'string' have no overlap.
```

This is because we're trying to compare the `theme` object with a string ('light'), but `theme` is actually an object, not a string. The fix is to use `themeType` instead, which is a string:

1. Open the file `src/styles/GlobalStyle.ts`
2. Replace all instances of `theme === 'light'` with `themeType === 'light'`
3. Save the file and restart the application

## Running the Mobile Application

To run the mobile application:

1. Navigate to the mobile directory:
   ```bash
   cd TaskMaster/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Follow the instructions to run on an emulator or physical device.

## Project Structure

```
TaskMaster/
├── web/                  # Web application
│   ├── public/           # Public assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context providers
│   │   ├── services/     # API and service functions
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript type definitions
│   │   ├── styles/       # Global styles
│   │   ├── App.tsx       # Main App component
│   │   └── index.tsx     # Entry point
│   ├── package.json      # Dependencies and scripts
│   └── tsconfig.json     # TypeScript configuration
│
├── mobile/               # Mobile application
│   ├── src/              # Source code (similar structure to web)
│   ├── package.json      # Dependencies and scripts
│   └── tsconfig.json     # TypeScript configuration
│
└── shared/               # Shared code between web and mobile
    ├── types/            # Shared type definitions
    ├── utils/            # Shared utility functions
    └── constants/        # Shared constants
```

## Development Roadmap

1. Phase 1: Core Functionality
   - Basic task CRUD operations
   - UI components
   - State management setup

2. Phase 2: Advanced Features
   - User authentication
   - Categories and tags
   - Filtering and search

3. Phase 3: Mobile Optimization
   - Responsive design
   - Touch interactions
   - Mobile-specific features

4. Phase 4: Offline Support
   - Local storage
   - Data synchronization
   - Conflict resolution
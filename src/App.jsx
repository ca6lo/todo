import React, { useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import { TaskProvider, TaskContext } from './context/TaskContext';
import { Dashboard } from './pages/Dashboard';

const AppContent = () => {
  const { isDarkMode } = useContext(TaskContext);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1a73e8', // Google Blue
          borderRadius: 8,
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif"
        },
        components: {
          Layout: {
            headerBg: 'var(--bg-primary)',
            bodyBg: 'var(--bg-secondary)',
            siderBg: 'var(--bg-secondary)'
          },
          Segmented: {
            itemSelectedBg: 'var(--bg-primary)',
            itemSelectedColor: 'var(--primary-color)'
          }
        }
      }}
    >
      <Dashboard />
    </ConfigProvider>
  );
};

export function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;

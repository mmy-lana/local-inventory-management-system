import React, { useEffect } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { enterpriseTheme } from './config/theme';
import { router } from './routes';
import { initializeDatabaseSeed } from './services/db';

export const App: React.FC = () => {
  useEffect(() => {
    initializeDatabaseSeed();
  }, []);

  return (
    <ConfigProvider theme={enterpriseTheme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
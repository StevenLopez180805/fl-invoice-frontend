import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { InvoicesPage } from './modules/Chat/pages/InvoicesPage';
import { NotFoundPage } from './components/common/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <InvoicesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
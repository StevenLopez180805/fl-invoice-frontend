import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { InvoicesPage } from './modules/Chat/pages/InvoicesPage';
import { ExpensesPage } from './modules/Expenses/pages/ExpensesPage';
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
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
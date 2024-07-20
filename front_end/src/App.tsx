import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Accounts } from './pages/accounts'
import Navbar from './components/nav-bar';
import { AccountDetails } from './pages/account_details';
import TransferFunds from './pages/transfere';
const queryClient = new QueryClient();

const App = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <Router >
        <div className='min-h-screen h-screen flex flex-col items-center  bg-[#fffcf5]'>
          <Navbar />
          <Routes>
            {/* Redirect root to the account list page */}
            <Route path="/" element={<Navigate to="/accounts" />} />

            {/* Define routes for each page */}
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:id" element={<AccountDetails />} />
            <Route path="/transfer" element={<TransferFunds />} />

            {/* Add a catch-all route for undefined paths */}
            <Route path="*" element={<h2>404 Not Found</h2>} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

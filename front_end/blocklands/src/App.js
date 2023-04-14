import './App.css';
import Main from './components/pages/Main'
import Header from './components/pages/Header'
import { AuthProvider } from './components/context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <AuthProvider>
        <Header/>
        <Main />
      </AuthProvider>
    </>
  );
}

export default App;

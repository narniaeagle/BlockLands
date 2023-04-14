import './App.css';
import Main from './components/pages/Main'
import Header from './components/pages/Header'
import { AuthProvider } from './components/context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <>
      <AuthProvider>
      <div className="bg-light">
        <Header/>
        <Main />
        </div>
      </AuthProvider>
    </>
  );
}

export default App;

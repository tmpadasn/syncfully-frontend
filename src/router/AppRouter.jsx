import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Header from '../components/Header';

export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </main>
    </div>
  );
}

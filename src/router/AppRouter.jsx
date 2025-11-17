import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import Header from '../components/Header';

export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/recommendations" element={<Recommendations/>} />
        </Routes>
      </main>
    </div>
  );
}

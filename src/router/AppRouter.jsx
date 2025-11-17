import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';

export default function AppRouter() {
  return (
    <div>
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </main>
    </div>
  );
}

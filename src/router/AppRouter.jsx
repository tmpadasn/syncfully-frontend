import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Recommendations from '../pages/Recommendations';
import Header from '../components/Header';
import SearchResults from '../pages/SearchResults';
import WorkDetails from '../pages/WorkDetails';

export default function AppRouter() {
  return (
    <div>
      <Header />
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/recommendations" element={<Recommendations/>} />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/works/:workId" element={<WorkDetails/>} />
        </Routes>
      </main>
    </div>
  );
}

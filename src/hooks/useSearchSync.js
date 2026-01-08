import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/*
  useSearchSync
  -------------
  Encapsulates the search input state, URL synchronization, and
  debounced navigation side-effects. Moving this logic into a hook
  keeps `Header` focused on presentation and composition.
*/
export function useSearchSync() {
  const location = useLocation();
  const navigate = useNavigate();

  const [term, setTerm] = useState('');
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Initialize input from URL when on the search route to preserve
    // history navigation semantics (back/forward) for users.
    if (location.pathname.startsWith('/search')) {
      const params = new URLSearchParams(location.search);
      const urlQuery = params.get('q') || '';
      setTerm(urlQuery);
    } else {
      setTerm('');
    }
  }, [location.pathname, location.search]);

  // Ensure any pending debounce timer is cleared on unmount.
  useEffect(() => () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); }, []);

  const doSearch = () => {
    const q = (term || '').trim();
    const currentParams = new URLSearchParams(location.search);
    if (q) currentParams.set('q', q); else currentParams.delete('q');
    navigate(`/search?${currentParams.toString()}`);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setTerm(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const q = (value || '').trim();
      const currentParams = new URLSearchParams(location.search);
      if (q) currentParams.set('q', q); else currentParams.delete('q');
      navigate(`/search?${currentParams.toString()}`);
    }, 300);
  };

  return { term, setTerm, handleSearchInput, doSearch, debounceTimerRef };
}

import api from './client';

export const getPopularWorks = async () => {
  const res = await api.get('/works/popular');
  return res.data;
};




import api from './client';

export const getUserRecommendations = async (userId) => {
  const res = await api.get(`/users/${userId}/recommendations`);
  return res.data;
};

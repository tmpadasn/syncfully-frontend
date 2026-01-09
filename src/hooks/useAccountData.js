import { useEffect, useState } from "react";
import {
  getUserById,
  getUserRatings,
  getUserFollowers,
  getUserFollowing,
} from "../api/users";
import { getAllWorks } from "../api/works";
import logger from "../utils/logger";

/**
 * Custom hook for fetching and managing account data
 * Handles all API calls, data normalization, and state management
 *
 * @param {number} userId - The user ID to fetch data for
 * @returns {Object} Account data including user, ratings, works, followers, following, and loading state
 */
export default function useAccountData(userId) {
  const [backendUser, setBackendUser] = useState(null);
  const [ratings, setRatings] = useState({});
  const [works, setWorks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);

      try {
        const [u, ratingsResponse, allWorks, followersResponse, followingResponse] = await Promise.all([
          getUserById(userId),
          getUserRatings(userId),
          getAllWorks().catch(err => {
            logger.error("Failed to fetch works:", err);
            return { works: [] };
          }),
          getUserFollowers(userId).catch(err => {
            logger.error("Failed to fetch followers:", err);
            return { followers: [] };
          }),
          getUserFollowing(userId).catch(err => {
            logger.error("Failed to fetch following:", err);
            return { following: [] };
          })
        ]);

        setBackendUser(u);

        // Ratings come as a map keyed by work id
        const ratingsObject = ratingsResponse?.ratings || ratingsResponse || {};
        // Keep only ratings for works that exist in the catalog
        const validWorks = allWorks?.works || [];
        const validWorkIds = new Set(validWorks.map(w => w.id || w.workId));
        const filteredRatings = Object.keys(ratingsObject).reduce((acc, workId) => {
          if (validWorkIds.has(Number(workId))) {
            acc[workId] = ratingsObject[workId];
          }
          return acc;
        }, {});

        setRatings(filteredRatings);
        setWorks(validWorks);

        // Set followers
        const followersList = followersResponse?.followers || [];
        setFollowers(followersList);

        // Set following
        const followingList = followingResponse?.following || [];
        setFollowing(followingList);

      } catch (err) {
        logger.error("Account data load failed:", err);
        // Don't set backendUser on error - let the component handle it
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  return {
    backendUser,
    ratings,
    works,
    followers,
    following,
    loading,
  };
}

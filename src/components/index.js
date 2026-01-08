/**
 * Components Index File
 *
 * Centralized export point for all components in the application.
 * Simplifies imports by allowing components to be imported from a single location.
 *
 * Usage:
 *   Instead of: import Header from '../components/Header.jsx'
 *   Use: import { Header } from '../components'
 */

// ========== ROOT LEVEL COMPONENTS ==========
export { default as AddToShelfBtn } from './AddToShelfBtn.jsx';
export { default as Carousel } from './Carousel.jsx';
export { default as ErrorBoundary } from './ErrorBoundary.jsx';
export { default as FeatureIcon } from './FeatureIcon.jsx';
export { default as Header } from './Header/Header.jsx';
export { FriendCardsCarousel, WorkCarousel } from './HomeCarousels.jsx';
export { default as HoverBar } from './HoverBar.jsx';
export { LoginPrompt } from './LoginPrompt.jsx';
export { Skeleton, default as SkeletonBase } from './SkeletonBase.jsx';
export { WorkGridSkeleton, FriendCardSkeleton, FriendGridSkeleton, WorkListSkeleton, default as SkeletonCards } from './SkeletonCards.jsx';
export { WorkDetailsSkeleton, default as SkeletonPages, ProfileSkeleton } from './SkeletonPages.jsx';
export { default as SkeletonSections } from './SkeletonSections.jsx';
export { default as Toast } from './Toast.jsx';
export { default as UserRatings } from './UserRatings.jsx';
export { default as WorkCard } from './WorkCard.jsx';

// ========== AUTH COMPONENTS ==========
export { default as AlertMessage } from './Auth/AlertMessage.jsx';
export { default as FormInput } from './Auth/FormInput.jsx';
export { default as LoginForm } from './Auth/LoginForm.jsx';
export { default as LoginHeader } from './Auth/LoginHeader.jsx';
export { default as LoginModeToggle } from './Auth/LoginModeToggle.jsx';

// ========== SHELVES COMPONENTS ==========
export { default as Shelf } from './Shelves/Shelf.jsx';
export { default as ShelfContent } from './Shelves/ShelfContent.jsx';
export { default as ShelfHeader } from './Shelves/ShelfHeader.jsx';
export { default as ShelfModal } from './Shelves/ShelfModal.jsx';
export { default as ShelvesPageHeader } from './Shelves/ShelvesPageHeader.jsx';
export { MessageAlert, DeleteConfirmation } from './Shelves/ConfirmationMessages.jsx';

// ========== EDIT ACCOUNT COMPONENTS ==========
export { default as ActionButton } from './EditAccount/ActionButton.jsx';
export { default as FormField } from './EditAccount/FormField.jsx';
export { default as MessageBox } from './EditAccount/MessageBox.jsx';
export { default as ProfileHeader } from './EditAccount/ProfileHeader.jsx';

// ========== PROFILE COMPONENTS ==========
export { default as ActionButtons } from './Profile/ActionButtons.jsx';
export { default as EditDeleteButtons } from './Profile/EditDeleteButtons.jsx';
export { FollowingSection, FollowersSection, default as FollowingSectionDefault } from './Profile/FollowingSection.jsx';
export { default as ProfileHeaderProfile } from './Profile/ProfileHeader.jsx';
export { default as RatingBreakdown } from './Profile/RatingBreakdown.jsx';
export { default as TopGenres } from './Profile/TopGenres.jsx';

// ========== FILTER BAR COMPONENTS ==========
export { default as FilterBar } from './FilterBar/FilterBar.jsx';
export { default as FilterItem } from './FilterBar/FilterItem.jsx';
export { default as MenuControl } from './FilterBar/MenuControl.jsx';

// ========== SEARCH RESULTS COMPONENTS ==========
export { AddToShelfBanner } from './SearchResults/AddToShelfBanner.jsx';
export { ResultHeader } from './SearchResults/ResultHeader.jsx';
export { SearchResultsLayout, SearchResultsHeader, NoResultsMessage, WorksSection, UsersSection, SearchResultsMessage, ResultsSection } from './SearchResults/SearchResultsLayout.jsx';
export { UserCard } from './SearchResults/UserCard.jsx';
export { WorkCard as WorkCardSearchResults } from './SearchResults/WorkCard.jsx';

// ========== WORK DETAILS COMPONENTS ==========
export { default as WorkDetailsLeftSidebar } from './WorkDetails/WorkDetailsLeftSidebar.jsx';
export { default as WorkDetailsMainContent } from './WorkDetails/WorkDetailsMainContent.jsx';
export { default as WorkDetailsRatings } from './WorkDetails/WorkDetailsRatings.jsx';

// ========== ADD TO SHELF BUTTON COMPONENTS ==========
export { AddToShelfModal } from './AddToShelfBtn/AddToShelfModal.jsx';
export { ShelfOptionButton } from './AddToShelfBtn/ShelfOptionButton.jsx';

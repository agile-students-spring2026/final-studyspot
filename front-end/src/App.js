/**
 * App.js — StudySpot Router
 * ─────────────────────────────────────────────────────────────────────────────
 * This file wires together all pages via React Router.
 *
 * HOW TO ADD A NEW PAGE
 * ─────────────────────
 * 1. Create your page component in src/pages/YourPage.js
 * 2. Import it below (keep imports alphabetical for sanity)
 * 3. Add a <Route path="/your-path" element={<YourPage />} /> inside <Routes>
 *
 * Design system:
 *   - CSS variables are in src/styles/globals.css (already imported in index.js)
 *   - Shared components (Button, Input) live in src/components/
 *   - Use CSS Modules (.module.css) for per-page styles
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SavedSpotsPage from './pages/SavedSpotsPage';
import ProfilePage from './pages/ProfilePage';

// TODO: teammates — import your pages here as you build them, e.g.:
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ChoosePasswordPage from './pages/ChoosePasswordPage';
import SpotDetailsPage from './pages/SpotDetailsPage';
import SpotListPage from './pages/SpotListPage';
import AddSpotPage from './pages/AddSpotPage';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AboutHelpPage from './pages/AboutHelpPage';
// import SettingsPage    from './pages/SettingsPage';
// import SavedSpotsPage  from './pages/SavedSpotsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth flow */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/choose-password" element={<ChoosePasswordPage />} />

        {/* Main app */}
        <Route path="/spots/:id" element={<SpotDetailsPage />} />
        <Route path="/saved" element={<SavedSpotsPage />} />

        {/* Profile page */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/about-help" element={<AboutHelpPage />} />

        <Route path="/spots" element={<SpotListPage />} />
        
        {/*Add Spot Page */}
        <Route path="/add-spot" element={<AddSpotPage />} />


        {/* TODO: teammates — add your routes here */}
        {/* <Route path="/saved"         element={<SavedSpotsPage />} /> */}
        
        {/* <Route path="/settings"      element={<SettingsPage />} /> */}

        {/* Default: redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
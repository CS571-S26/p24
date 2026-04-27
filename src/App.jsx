import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import PickForMePage from './pages/PickForMePage.jsx'
import SignInPage from './pages/SignInPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'
import Layout from './components/Layout.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="movie/:id" element={<MovieDetailPage mediaType="movie" />} />
        <Route path="tv/:id" element={<MovieDetailPage mediaType="tv" />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="pick" element={<PickForMePage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

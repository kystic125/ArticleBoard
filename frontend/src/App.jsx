import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ArticleListPage from './pages/ArticleListPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import ArticleFormPage from './pages/ArticleFormPage'
import MyPage from './pages/MyPage'

export default function App() {
  const [homeKey, setHomeKey] = useState(0)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onLogoClick={() => setHomeKey((k) => k + 1)} />
        <Routes>
          <Route path="/" element={<ArticleListPage key={homeKey} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/articles/new" element={<ArticleFormPage />} />
            <Route path="/articles/:id/edit" element={<ArticleFormPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

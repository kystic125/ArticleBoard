import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import ArticleFormPage from '@/pages/ArticleFormPage'
import ArticleListPage from '@/pages/ArticleListPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen'>
        <BrowserRouter>
          <Navbar />
          <main className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8'>
            <Routes>
              <Route path='/' element={<ArticleListPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/articles/:id' element={<ArticleDetailPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/articles/new' element={<ArticleFormPage />} />
                <Route path='/articles/:id/edit' element={<ArticleFormPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

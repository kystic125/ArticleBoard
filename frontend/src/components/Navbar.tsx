import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { logout as logoutApi } from '@/api/authApi'
import { useAuth } from '@/context/AuthContext'

const THEME_STORAGE_KEY = 'articleboard-theme'

const THEMES = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'articleboard',
] as const

type ThemeName = (typeof THEMES)[number]

function getInitialTheme(): ThemeName {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved && THEMES.includes(saved as ThemeName)) {
    return saved as ThemeName
  }
  return 'articleboard'
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch {
      // noop
    }
    logout()
    navigate('/login')
  }

  return (
    <div className='sticky top-0 z-30 border-b border-base-300/70 bg-base-100/90 backdrop-blur'>
      <div className='navbar mx-auto w-full max-w-6xl px-4 md:px-6'>
        <div className='navbar-start'>
          <button onClick={() => navigate('/')} className='btn btn-ghost -ml-2 gap-2 text-lg normal-case'>
            <span className='badge badge-primary badge-sm' />
            ArticleBoard
          </button>
        </div>

        <div className='navbar-center hidden lg:flex'>
          <div className='join'>
            <Link to='/' className={`btn btn-sm join-item ${location.pathname === '/' ? 'btn-primary' : 'btn-ghost'}`}>
              홈
            </Link>
            {isAuthenticated && (
              <Link
                to='/articles/new'
                className={`btn btn-sm join-item ${location.pathname.includes('/articles/new') ? 'btn-primary' : 'btn-ghost'}`}
              >
                글쓰기
              </Link>
            )}
          </div>
        </div>

        <div className='navbar-end gap-2'>
          <div className='dropdown dropdown-end'>
            <button tabIndex={0} type='button' className='btn btn-outline btn-sm gap-2'>
              Theme
              <span className='badge badge-neutral badge-xs' />
            </button>
            <ul tabIndex={0} className='menu dropdown-content z-[1] mt-2 w-80 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl max-h-80 overflow-y-auto'>
              <li className='menu-title'>
                <span>Theme</span>
              </li>
              {THEMES.map((theme) => {
                const selected = currentTheme === theme
                return (
                  <li key={theme}>
                    <button type='button' onClick={() => handleThemeChange(theme)} className='flex items-center gap-3'>
                      <span data-theme={theme} className='grid grid-cols-2 gap-0.5 rounded-md border border-base-300 p-1'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                        <span className='h-1.5 w-1.5 rounded-full bg-secondary' />
                        <span className='h-1.5 w-1.5 rounded-full bg-accent' />
                        <span className='h-1.5 w-1.5 rounded-full bg-neutral' />
                      </span>
                      <span className='capitalize'>{theme}</span>
                      {selected && <span className='ml-auto'>✓</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {isAuthenticated ? (
            <>
              <Link to='/articles/new' className='btn btn-primary btn-sm lg:hidden'>글쓰기</Link>
              <button onClick={handleLogout} className='btn btn-outline btn-sm'>로그아웃</button>
            </>
          ) : (
            <>
              <Link to='/login' className='btn btn-ghost btn-sm'>로그인</Link>
              <Link to='/register' className='btn btn-primary btn-sm'>회원가입</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

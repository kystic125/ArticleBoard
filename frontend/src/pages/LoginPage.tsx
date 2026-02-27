import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { login as loginApi } from '@/api/authApi'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await loginApi(username, password)
      login(res.data.accessToken)
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.message || '로그인에 실패했습니다.'
      setError(msg)
    }
  }

  return (
    <section className='relative min-h-[76vh] overflow-hidden'>
      <div className='pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-primary/15 blur-3xl login-float' />
      <div className='pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl login-float-delay' />

      <div className='mx-auto grid w-full max-w-6xl gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-10'>
        <article className='relative overflow-hidden rounded-[2rem] border border-base-300/70 bg-gradient-to-br from-base-100 via-base-100 to-base-200/90 p-7 shadow-xl login-fade-up'>
          <p className='text-xs font-bold uppercase tracking-[0.25em] text-primary/70'>ArticleBoard</p>
          <h1 className='mt-3 text-3xl font-black leading-tight md:text-4xl'>
            대화를 기록하고,
            <br />
            흐름을 키우는 공간
          </h1>
          <p className='mt-4 max-w-xl text-base-content/70'>
            로그인하면 게시글 작성, 댓글 참여, 투표 기능까지 한 번에 사용할 수 있습니다.
          </p>

          <div className='mt-8 grid gap-3 sm:grid-cols-3'>
            <div className='rounded-2xl border border-primary/20 bg-primary/10 p-4 login-fade-up delay-100'>
              <p className='text-xs font-semibold text-primary/80'>THREAD</p>
              <p className='mt-1 text-lg font-extrabold'>실시간 토론</p>
            </div>
            <div className='rounded-2xl border border-secondary/20 bg-secondary/10 p-4 login-fade-up delay-200'>
              <p className='text-xs font-semibold text-secondary/80'>MANAGE</p>
              <p className='mt-1 text-lg font-extrabold'>공지 관리</p>
            </div>
            <div className='rounded-2xl border border-accent/30 bg-accent/15 p-4 login-fade-up delay-300'>
              <p className='text-xs font-semibold text-accent-content/80'>VOTE</p>
              <p className='mt-1 text-lg font-extrabold'>좋아요/싫어요</p>
            </div>
          </div>

          <div className='mt-8 space-y-2 text-sm text-base-content/70'>
            <p className='login-fade-up delay-200'>1. 중요한 이슈를 빠르게 공유</p>
            <p className='login-fade-up delay-300'>2. 댓글로 피드백 수집</p>
            <p className='login-fade-up delay-500'>3. 투표로 우선순위 결정</p>
          </div>
        </article>

        <article className='relative rounded-[2rem] border border-base-300/70 bg-base-100/95 p-6 shadow-xl login-fade-up-delay'>
          <div className='mb-6 text-center'>
            <h2 className='text-3xl font-black'>로그인</h2>
            <p className='mt-1 text-sm text-base-content/60'>계정 정보로 바로 접속하세요.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-4 rounded-2xl border border-base-300/70 bg-base-200/50 p-4'>
              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>아이디</span>
                </div>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  className='input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                  placeholder='아이디'
                  required
                />
              </label>

              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>비밀번호</span>
                </div>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className='input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                  placeholder='비밀번호'
                  required
                />
              </label>
            </div>

            {error && <div className='alert alert-error py-2 text-sm'>{error}</div>}

            <button
              type='submit'
              className='btn w-full border-0 bg-gradient-to-r from-primary to-secondary text-primary-content hover:brightness-110'
            >
              로그인
            </button>
          </form>

          <div className='mt-6 rounded-xl border border-dashed border-base-300 p-3 text-center text-sm text-base-content/70'>
            계정이 없으신가요?{' '}
            <Link to='/register' className='font-bold text-primary underline underline-offset-4'>
              회원가입
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

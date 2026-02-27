import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register as registerApi } from '@/api/authApi'

export default function RegisterPage() {
  const [form, setForm] = useState({
    userName: '',
    userPassword: '',
    nickname: '',
    nicknameType: 'FIXED' as 'FIXED' | 'TEMPORARY',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      await registerApi(form.userName, form.userPassword, form.nickname, form.nicknameType)
      navigate('/login')
    } catch (err: any) {
      const msg = err.response?.data?.message || '회원가입에 실패했습니다.'
      setError(msg)
    }
  }

  return (
    <section className='relative min-h-[76vh] overflow-hidden'>
      <div className='pointer-events-none absolute -left-20 top-14 h-56 w-56 rounded-full bg-secondary/20 blur-3xl login-float' />
      <div className='pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl login-float-delay' />

      <div className='mx-auto grid w-full max-w-6xl gap-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-10'>
        <article className='relative overflow-hidden rounded-[2rem] border border-base-300/70 bg-gradient-to-br from-base-100 via-base-100 to-base-200/90 p-7 shadow-xl login-fade-up'>
          <p className='text-xs font-bold uppercase tracking-[0.25em] text-secondary/80'>Join ArticleBoard</p>
          <h1 className='mt-3 text-3xl font-black leading-tight md:text-4xl'>
            새 계정을 만들고
            <br />
            바로 참여하세요
          </h1>
          <p className='mt-4 max-w-xl text-base-content/70'>
            가입 후 게시글 작성, 댓글 작성, 추천/비추천 기능까지 바로 사용할 수 있습니다.
          </p>

          <div className='mt-8 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-2xl border border-primary/20 bg-primary/10 p-4 login-fade-up delay-100'>
              <p className='text-xs font-semibold text-primary/80'>ID</p>
              <p className='mt-1 text-lg font-extrabold'>최대 20자</p>
            </div>
            <div className='rounded-2xl border border-accent/30 bg-accent/10 p-4 login-fade-up delay-200'>
              <p className='text-xs font-semibold text-accent-content/80'>NICKNAME</p>
              <p className='mt-1 text-lg font-extrabold'>최대 10자</p>
            </div>
          </div>

          <div className='mt-8 flex flex-wrap gap-2 text-sm'>
            <span className='rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/80'>고정 닉네임 선택</span>
            <span className='rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/80'>임시 닉네임 선택</span>
            <span className='rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-base-content/80'>가입 즉시 이용 가능</span>
          </div>
        </article>

        <article className='relative rounded-[2rem] border border-base-300/70 bg-base-100/95 p-6 shadow-xl login-fade-up-delay'>
          <div className='mb-6 text-center'>
            <h2 className='text-3xl font-black'>회원가입</h2>
            <p className='mt-1 text-sm text-base-content/60'>계정 정보를 입력해 주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-4 rounded-2xl border border-base-300/70 bg-base-200/50 p-4'>
              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>아이디</span>
                </div>
                <input
                  type='text'
                  name='userName'
                  value={form.userName}
                  onChange={handleChange}
                  className='input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                  placeholder='최대 20자'
                  maxLength={20}
                  required
                />
              </label>

              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>비밀번호</span>
                </div>
                <input
                  type='password'
                  name='userPassword'
                  value={form.userPassword}
                  onChange={handleChange}
                  className='input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                  placeholder='비밀번호를 입력하세요'
                  required
                />
              </label>

              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>닉네임</span>
                </div>
                <input
                  type='text'
                  name='nickname'
                  value={form.nickname}
                  onChange={handleChange}
                  className='input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                  placeholder='최대 10자'
                  maxLength={10}
                  required
                />
              </label>

              <label className='form-control'>
                <div className='label'>
                  <span className='label-text font-semibold'>닉네임 유형</span>
                </div>
                <select
                  name='nicknameType'
                  value={form.nicknameType}
                  onChange={handleChange}
                  className='select select-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none'
                >
                  <option value='FIXED'>고정 닉네임</option>
                  <option value='TEMPORARY'>임시 닉네임</option>
                </select>
              </label>
            </div>

            {error && <div className='alert alert-error py-2 text-sm'>{error}</div>}

            <button
              type='submit'
              className='btn w-full border-0 bg-gradient-to-r from-primary to-secondary text-primary-content hover:brightness-110'
            >
              가입하기
            </button>
          </form>

          <div className='mt-6 rounded-xl border border-dashed border-base-300 p-3 text-center text-sm text-base-content/70'>
            이미 계정이 있으신가요?{' '}
            <Link to='/login' className='font-bold text-primary underline underline-offset-4'>
              로그인
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

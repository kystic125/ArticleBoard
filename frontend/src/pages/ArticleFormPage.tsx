import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { createArticle, getArticle, updateArticle } from '@/api/articleApi'
import { useAuth } from '@/context/AuthContext'

export default function ArticleFormPage() {
  const { role } = useAuth()
  const isManager = role === 'MANAGER'
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', content: '', isNotice: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit || !id) return
    getArticle(id)
      .then((res) => {
        const { title, content, isNotice } = res.data as {
          title: string
          content: string
          isNotice?: boolean
        }
        setForm({ title, content, isNotice: isNotice ?? false })
      })
      .catch(() => navigate('/'))
  }, [id, isEdit, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit && id) {
        await updateArticle(id, form.title, form.content, form.isNotice)
        navigate(`/articles/${id}`)
      } else {
        const res = await createArticle(form.title, form.content, form.isNotice)
        navigate(`/articles/${res.data}`)
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '저장에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='card border border-base-300 bg-base-100 shadow-sm'>
        <div className='card-body gap-5 p-6 md:p-8'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-black'>{isEdit ? '게시글 수정' : '새 게시글 작성'}</h2>
            <p className='text-sm text-base-content/70'>명확한 제목과 구조적인 본문을 작성하면 반응이 좋아집니다.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <label className='form-control'>
              <div className='label'>
                <span className='label-text font-semibold'>제목</span>
                <span className='label-text-alt'>{form.title.length}/100</span>
              </div>
              <input
                type='text'
                name='title'
                value={form.title}
                onChange={handleChange}
                className='input input-bordered input-primary w-full'
                placeholder='제목을 입력하세요 (최대 100자)'
                maxLength={100}
                required
              />
            </label>

            <label className='form-control'>
              <div className='label'>
                <span className='label-text font-semibold'>내용</span>
                <span className='label-text-alt'>{form.content.length}/5000</span>
              </div>
              <textarea
                name='content'
                value={form.content}
                onChange={handleChange}
                className='textarea textarea-bordered textarea-primary h-72 w-full leading-7'
                placeholder='내용을 입력하세요 (최대 5000자)'
                maxLength={5000}
                required
              />
            </label>

            {isManager && (
              <div className='alert border border-info/30 bg-info/10 py-2'>
                <label className='label cursor-pointer justify-start gap-3'>
                  <input
                    type='checkbox'
                    name='isNotice'
                    checked={form.isNotice}
                    onChange={handleChange}
                    className='checkbox checkbox-info checkbox-sm'
                  />
                  <span className='label-text'>이 글을 공지글로 등록</span>
                </label>
              </div>
            )}

            {error && <div className='alert alert-error text-sm'>{error}</div>}

            <div className='flex flex-wrap justify-end gap-2'>
              <button type='button' onClick={() => navigate(-1)} className='btn btn-ghost'>취소</button>
              <button type='submit' disabled={loading} className='btn btn-primary min-w-32'>
                {loading ? <span className='loading loading-spinner loading-xs' /> : null}
                {loading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

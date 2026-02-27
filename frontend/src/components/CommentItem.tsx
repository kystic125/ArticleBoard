import { useState } from 'react'

import { createReply, deleteComment, updateComment } from '@/api/commentApi'
import { useAuth } from '@/context/AuthContext'
import type { Comment } from '@/types/models'

type CommentItemProps = {
  comment: Comment
  replies?: Comment[]
  writerMap?: Record<number, string>
  onRefresh: () => void
}

export default function CommentItem({ comment, replies = [], writerMap = {}, onRefresh }: CommentItemProps) {
  const { isAuthenticated, userId } = useAuth()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const isOwner = isAuthenticated && userId === comment.userId

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    try {
      await updateComment(comment.commentId, editContent)
      setEditing(false)
      onRefresh()
    } catch (err: any) {
      alert(err.response?.data?.message || '수정에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await deleteComment(comment.commentId)
      onRefresh()
    } catch (err: any) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    try {
      await createReply(comment.commentId, replyContent)
      setReplyContent('')
      setShowReplyForm(false)
      onRefresh()
    } catch (err: any) {
      alert(err.response?.data?.message || '답글 작성에 실패했습니다.')
    }
  }

  const replyTo = comment.rootId !== null ? writerMap[comment.parentId ?? -1] : null

  if (comment.isDeleted) {
    return (
      <div className='space-y-2 py-3'>
        <div className='rounded-box bg-base-200 px-3 py-2 text-sm italic text-base-content/60'>삭제된 댓글입니다.</div>
        {replies.map((reply) => (
          <CommentItem key={reply.commentId} comment={reply} replies={[]} writerMap={writerMap} onRefresh={onRefresh} />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-2 py-3'>
      <div className='flex items-start gap-3'>
        <div className='avatar placeholder mt-1'>
          <div className='h-8 w-8 rounded-full bg-neutral text-neutral-content'>
            <span className='text-xs'>{comment.writer.slice(0, 1)}</span>
          </div>
        </div>

        <div className='flex-1 space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='font-semibold'>{comment.writer}</span>
            <span className='text-xs text-base-content/50'>{formatDate(comment.createdAt)}</span>
            {isOwner && !editing && (
              <div className='ml-auto join'>
                <button onClick={() => setEditing(true)} className='btn btn-ghost btn-xs join-item'>수정</button>
                <button onClick={handleDelete} className='btn btn-ghost btn-xs text-error join-item'>삭제</button>
              </div>
            )}
          </div>

          {editing ? (
            <div className='space-y-2'>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className='textarea textarea-bordered textarea-sm w-full'
                rows={3}
                maxLength={150}
              />
              <div className='flex justify-end gap-2'>
                <button onClick={() => setEditing(false)} className='btn btn-outline btn-xs'>취소</button>
                <button onClick={handleUpdate} className='btn btn-primary btn-xs'>저장</button>
              </div>
            </div>
          ) : (
            <button
              type='button'
              className={`w-full rounded-box bg-base-200 px-3 py-2 text-left text-sm leading-6 ${isAuthenticated ? 'hover:bg-base-300' : ''}`}
              onClick={isAuthenticated ? () => setShowReplyForm((prev) => !prev) : undefined}
            >
              {replyTo && <span className='mr-1 text-secondary'>@{replyTo}</span>}
              <span className='whitespace-pre-wrap'>{comment.content}</span>
            </button>
          )}

          {showReplyForm && (
            <form onSubmit={handleReply} className='rounded-box border border-base-300 bg-base-100 p-3'>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className='textarea textarea-bordered textarea-sm w-full'
                placeholder='답글을 입력하세요 (최대 150자)'
                rows={2}
                maxLength={150}
                required
              />
              <div className='mt-2 flex justify-end gap-2'>
                <button type='button' onClick={() => setShowReplyForm(false)} className='btn btn-outline btn-xs'>취소</button>
                <button type='submit' className='btn btn-primary btn-xs'>답글 등록</button>
              </div>
            </form>
          )}

          {replies.length > 0 && (
            <div className='ml-4 border-l-2 border-base-300 pl-3'>
              {replies.map((reply) => (
                <CommentItem key={reply.commentId} comment={reply} replies={[]} writerMap={writerMap} onRefresh={onRefresh} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

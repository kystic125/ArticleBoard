type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <div className='card border border-base-300 bg-base-100 shadow-sm'>
      <div className='card-body items-center gap-4 p-4'>
        <div className='join'>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className='btn btn-sm join-item'
          >
            이전
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`btn btn-sm join-item ${page === currentPage ? 'btn-primary' : 'btn-ghost'}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className='btn btn-sm join-item'
          >
            다음
          </button>
        </div>
        <p className='text-xs text-base-content/60'>현재 {currentPage + 1} / {totalPages} 페이지</p>
      </div>
    </div>
  )
}

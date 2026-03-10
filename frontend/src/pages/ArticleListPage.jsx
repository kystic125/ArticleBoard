import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getArticleList, searchArticles, searchPopularArticles, searchNoticeArticles, getPopularArticles, getNoticeArticles } from '../api/articleApi'
import { useAuth } from '../context/AuthContext'
import ArticleCard from '../components/ArticleCard'
import Pagination from '../components/Pagination'

const SEARCH_TYPES = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'title-content', label: '제목+내용' },
  { value: 'writer', label: '작성자' },
]

const TABS = [
  { value: 'all', label: '전체' },
  { value: 'popular', label: '인기글' },
  { value: 'notice', label: '공지' },
]

export default function ArticleListPage() {
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchType, setSearchType] = useState('title')
  const [keyword, setKeyword] = useState('')
  const [activeSearch, setActiveSearch] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const fetchArticles = async (pageNum) => {
    setLoading(true)
    try {
      let res
      if (activeSearch) {
        if (activeTab === 'popular') {
          res = await searchPopularArticles(activeSearch.type, activeSearch.keyword, pageNum)
        } else if (activeTab === 'notice') {
          res = await searchNoticeArticles(activeSearch.type, activeSearch.keyword, pageNum)
        } else {
          res = await searchArticles(activeSearch.type, activeSearch.keyword, pageNum)
        }
      } else if (activeTab === 'popular') {
        res = await getPopularArticles(pageNum)
      } else if (activeTab === 'notice') {
        res = await getNoticeArticles(pageNum)
      } else {
        res = await getArticleList(pageNum)
      }
      setArticles(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(res.data.number)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(page)
  }, [page, activeSearch, activeTab])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!keyword.trim()) {
      setActiveSearch(null)
    } else {
      setActiveSearch({ type: searchType, keyword: keyword.trim() })
    }
    setPage(0)
  }

  const handleReset = () => {
    setKeyword('')
    setActiveSearch(null)
    setPage(0)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveSearch(null)
    setKeyword('')
    setPage(0)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>게시글 목록</h2>
        {isAuthenticated && (
          <button onClick={() => navigate('/articles/new')} style={styles.writeButton}>
            글쓰기
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={styles.select}
        >
          {SEARCH_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>검색</button>
        {activeSearch && (
          <button type="button" onClick={handleReset} style={styles.resetButton}>초기화</button>
        )}
      </form>

      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.value ? styles.tabButtonActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.list}>
        {loading ? (
          <p style={styles.message}>로딩 중...</p>
        ) : articles.length === 0 ? (
          <p style={styles.message}>게시글이 없습니다.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#333',
  },
  writeButton: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '0',
  },
  select: {
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  searchButton: {
    padding: '8px 16px',
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  resetButton: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#555',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '2px solid #ddd',
    margin: '12px 0 0 0',
  },
  tabButton: {
    padding: '8px 20px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    fontSize: '0.95rem',
    color: '#888',
    cursor: 'pointer',
    fontWeight: '400',
  },
  tabButtonActive: {
    color: '#1976d2',
    borderBottom: '2px solid #1976d2',
    fontWeight: '600',
  },
  list: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    overflow: 'hidden',
  },
  message: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  views: number;
  authorId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
    likes: number;
  };
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
      } else {
        setError(data.error || '게시글을 불러오는데 실패했습니다.');
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
        }
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?\n(댓글과 좋아요도 함께 삭제됩니다)')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      const response = await fetch(`/api/admin/posts?id=${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert(data.error || '게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">게시글 관리</h1>
          <p className="text-gray-600">
            총 {posts.length}개의 게시글
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    댓글
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    좋아요
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md truncate" title={post.title}>
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="text-gray-500 text-xs">{post.author.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post._count.comments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post._count.likes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          보기
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleteLoading === post.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading === post.id ? '삭제 중...' : '삭제'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {selectedPost.author.name}
                  </span>
                  <span>{selectedPost.author.email}</span>
                  <span>•</span>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>조회수: {selectedPost.views}</span>
                  <span>댓글: {selectedPost._count.comments}</span>
                  <span>좋아요: {selectedPost._count.likes}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
              >
                ×
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800">
                  {selectedPost.content}
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                게시글 ID: {selectedPost.id}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                      setSelectedPost(null);
                      handleDelete(selectedPost.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  삭제
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

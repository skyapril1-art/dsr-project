"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    checkSession();
    loadPost();
  }, [postId]);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('세션 확인 오류:', error);
    }
  };

  const loadPost = async () => {
    if (!postId) return;
    
    try {
      console.log('게시글 ID:', postId);
      const response = await fetch(`/api/community/${postId}`);
      console.log('응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('받은 데이터:', data);
        setPost(data.post);
      } else {
        const errorData = await response.json();
        console.error('오류 응답:', errorData);
        alert('게시글을 찾을 수 없습니다.');
        router.push('/community/board');
      }
    } catch (error) {
      console.error('게시글 로드 오류:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      router.push('/community/board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/community/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        router.push('/community/board');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c69d6c]"></div>
          <p className="mt-4 text-gray-600">게시글을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const canEdit = currentUser && (currentUser.id === post.author.id || currentUser.role === 'admin');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            href="/community/board"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#c69d6c] transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>목록으로</span>
          </Link>
        </div>

        {/* 게시글 내용 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 헤더 */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#c69d6c] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {post.author.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700">{post.author.name}</span>
                </div>
                <span>·</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <i className="fa-solid fa-eye text-xs"></i>
                  <span>0</span>
                </span>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          {canEdit && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => router.push(`/community/board/${post.id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  <i className="fa-solid fa-pen mr-2"></i>
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 댓글 섹션 (나중에 구현) */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 <span className="text-[#c69d6c]">0</span>
          </h2>
          <div className="text-center py-8 text-gray-500">
            <i className="fa-solid fa-comments text-4xl mb-3 opacity-50"></i>
            <p>아직 댓글이 없습니다.</p>
            <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

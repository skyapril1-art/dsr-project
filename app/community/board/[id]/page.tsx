"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  views: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  likesCount: number;
  likes: any[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{[key: number]: boolean}>({});
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    checkSession();
    loadPost();
    loadComments();
  }, [postId]);

  useEffect(() => {
    if (currentUser && post) {
      checkPostLikeStatus();
    }
  }, [currentUser, post]);

  useEffect(() => {
    if (currentUser && comments.length > 0) {
      checkCommentsLikeStatus();
    }
  }, [currentUser, comments.length]);

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

  const loadComments = async () => {
    if (!postId) return;
    
    try {
      const response = await fetch(`/api/community/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('댓글 로드 오류:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          authorId: currentUser.id,
        }),
      });

      if (response.ok) {
        setCommentContent('');
        loadComments(); // 댓글 목록 새로고침
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/community/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadComments(); // 댓글 목록 새로고침
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const checkPostLikeStatus = async () => {
    if (!currentUser || !postId) return;
    
    try {
      const response = await fetch(`/api/community/${postId}/like?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setPostLiked(data.liked);
      }
    } catch (error) {
      console.error('좋아요 상태 확인 오류:', error);
    }
  };

  const checkCommentsLikeStatus = async () => {
    if (!currentUser) return;
    
    const likes: {[key: number]: boolean} = {};
    for (const comment of comments) {
      const isLiked = comment.likes.some((like: any) => like.userId === currentUser.id);
      likes[comment.id] = isLiked;
    }
    setCommentLikes(likes);
  };

  const handlePostLike = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setPostLiked(data.liked);
        if (post) {
          setPost({ ...post, likesCount: data.likesCount });
        }
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/community/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setCommentLikes({ ...commentLikes, [commentId]: data.liked });
        
        // 댓글 목록에서 해당 댓글의 좋아요 수 업데이트
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, likesCount: data.likesCount } : c
        ));
      }
    } catch (error) {
      console.error('댓글 좋아요 처리 오류:', error);
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 뒤로가기 버튼 스켈레톤 */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* 게시글 카드 스켈레톤 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 헤더 스켈레톤 */}
            <div className="border-b border-gray-200 p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* 본문 스켈레톤 */}
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* 좋아요 버튼 스켈레톤 */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 스켈레톤 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
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
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <i className="fa-solid fa-eye text-xs"></i>
                  <span>{post.views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <i className="fa-solid fa-heart text-xs text-red-500"></i>
                  <span>{post.likesCount}</span>
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

          {/* 좋아요 버튼 */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-center">
              <button
                onClick={handlePostLike}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition ${
                  postLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`fa-${postLiked ? 'solid' : 'regular'} fa-heart text-xl`}></i>
                <span className="font-medium">좋아요 {post.likesCount}</span>
              </button>
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

        {/* 댓글 섹션 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 <span className="text-[#c69d6c]">{comments.length}</span>
          </h2>

          {/* 댓글 작성 폼 */}
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#c69d6c] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c69d6c] focus:border-transparent resize-none"
                    disabled={isSubmitting}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentContent.trim()}
                      className="px-4 py-2 bg-[#c69d6c] text-white rounded-lg hover:bg-[#b8906b] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '작성 중...' : '댓글 작성'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link href="/login" className="text-[#c69d6c] hover:underline font-medium">
                  로그인
                </Link>
                하시면 댓글을 작성할 수 있습니다.
              </p>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-t border-gray-100 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[#c69d6c] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.author.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currentUser && (currentUser.id === comment.author.id || currentUser.role === 'admin') && (
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              className="text-xs text-red-500 hover:text-red-700 transition"
                            >
                              <i className="fa-solid fa-trash mr-1"></i>
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap mb-2">{comment.content}</p>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 text-xs transition ${
                          commentLikes[comment.id]
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <i className={`fa-${commentLikes[comment.id] ? 'solid' : 'regular'} fa-heart`}></i>
                        <span>좋아요 {comment.likesCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fa-solid fa-comments text-4xl mb-3 opacity-50"></i>
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

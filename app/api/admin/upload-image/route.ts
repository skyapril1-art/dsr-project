import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/app/lib/sessions';

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 확장자 확인
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9가-힣.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // public/images/gallery 폴더에 저장
    const filePath = join(process.cwd(), 'public', 'images', 'gallery', fileName);
    await writeFile(filePath, buffer);

    // 저장된 파일의 URL 경로 반환
    const imageUrl = `/images/gallery/${fileName}`;

    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: '이미지가 업로드되었습니다.'
    });

  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}

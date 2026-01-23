// 세션 테스트 스크립트
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('=== 로그인 테스트 시작 ===\n');
    
    // 로그인 요청
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('로그인 응답 상태:', loginResponse.status);
    console.log('로그인 응답 데이터:', loginData);
    
    // 쿠키 확인
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('\n설정된 쿠키:', cookies);

    if (cookies) {
      const sessionId = cookies.match(/sessionId=([^;]+)/)?.[1];
      console.log('추출된 sessionId:', sessionId);

      // 세션 확인 요청
      console.log('\n=== 세션 확인 요청 ===\n');
      const sessionResponse = await fetch('http://localhost:3001/api/auth/session', {
        headers: {
          'Cookie': `sessionId=${sessionId}`
        }
      });

      const sessionData = await sessionResponse.json();
      console.log('세션 확인 응답 상태:', sessionResponse.status);
      console.log('세션 확인 응답 데이터:', sessionData);
    }

  } catch (error) {
    console.error('테스트 오류:', error);
  }
}

testLogin();

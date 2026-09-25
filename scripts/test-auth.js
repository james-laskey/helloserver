// scripts/test-auth.js

const API_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🔐 Testing JWT Authentication\n');
  console.log('=' .repeat(50));

  try {
    // 1. Signup
    console.log('\n📝 1. Testing Signup...');
    const uniqueEmail = `test${Date.now()}@example.com`;
    const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      })
    });
    const signupData = await signupRes.json();
    
    if (!signupRes.ok) {
      console.error('❌ Signup failed:', signupData.error);
      return;
    }
    console.log('✅ Signup successful!');
    console.log('   User:', signupData.user?.name);
    console.log('   Email:', signupData.user?.email);

    if (!signupData.accessToken) {
      console.error('❌ No access token received');
      return;
    }

    let accessToken = signupData.accessToken;
    let refreshToken = signupData.refreshToken;
    console.log('   Access Token received ✓');
    console.log('   Refresh Token received ✓');

    // 2. Get user info with access token
    console.log('\n👤 2. Testing Get User Info...');
    const meRes = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const userData = await meRes.json();
    
    if (!meRes.ok) {
      console.error('❌ Failed to get user info:', userData.error);
    } else {
      console.log('✅ User info retrieved!');
      console.log('   Name:', userData.name);
      console.log('   Email:', userData.email);
    }

    // 3. Test protected route without token (should fail)
    console.log('\n🔒 3. Testing Protected Route Without Token...');
    const protectedRes = await fetch(`${API_URL}/api/learning/generate-flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    if (protectedRes.status === 401) {
      console.log('✅ Protected route correctly rejected unauthenticated request');
    } else {
      console.log('⚠️ Protected route allowed unauthenticated request (status:', protectedRes.status, ')');
    }

    // 4. Refresh token
    console.log('\n🔄 4. Testing Token Refresh...');
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const refreshData = await refreshRes.json();
    
    if (!refreshRes.ok) {
      console.error('❌ Token refresh failed:', refreshData.error);
    } else {
      console.log('✅ Token refreshed successfully!');
      console.log('   New Access Token received ✓');
      accessToken = refreshData.accessToken;
    }

    // 5. Test with new access token
    console.log('\n✅ 5. Testing with New Access Token...');
    const meRes2 = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (meRes2.ok) {
      console.log('✅ New access token works!');
    } else {
      console.log('❌ New access token failed');
    }

    // 6. Logout
    console.log('\n🚪 6. Testing Logout...');
    const logoutRes = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
    });
    const logoutData = await logoutRes.json();

    if (logoutRes.ok) {
    console.log('✅ Logout successful!');
    console.log('   Response:', logoutData.message || 'Logged out');
    } else {
    console.log('❌ Logout failed:', logoutData.error);
    }

    // 7. Test with revoked refresh token
    console.log('\n🔁 7. Testing with Revoked Refresh Token...');
    const refreshRes2 = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
    });

    if (refreshRes2.status === 401) {
    const errorData = await refreshRes2.json();
    console.log('✅ Revoked refresh token correctly rejected');
    console.log('   Reason:', errorData.error);
    } else if (refreshRes2.status === 200) {
    console.log('⚠️ Revoked refresh token still worked - check your implementation');
    } else {
    console.log(`⚠️ Unexpected status: ${refreshRes2.status}`);
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testAuth();
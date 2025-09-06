// Test utility per verificare il funzionamento dell'API client
import { apiClient } from './apiClient.js';

export async function testApiConnection() {
  console.log('=== API CLIENT TEST ===');
  console.log('Environment:', {
    isCloudflarePages: apiClient.isCloudflarePages,
    backendUrl: apiClient.backendUrl,
    CF_PAGES: import.meta.env.CF_PAGES,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
  });

  // Mock payload per test
  const testPayload = {
    user_type: "myself",
    event_type: "test",
    start_date: "2025-01-01",
    location: "Test Location",
    indoor_outdoor: "indoor",
    guests: "50-100",
    concert_duration: "2_hours",
    full_name: "Test User",
    email: "test@example.com"
  };

  console.log('Test payload:', testPayload);

  try {
    console.log('Attempting API call...');
    const result = await apiClient.submitForm(testPayload);
    console.log('✅ API call successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Export per uso in development console
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
}
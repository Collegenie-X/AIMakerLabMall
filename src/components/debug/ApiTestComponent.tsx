import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Card, CardContent } from '@mui/material';
import { API_CONFIG, apiHelpers } from '../../config/api';

/**
 * API 테스트 컴포넌트
 */
const ApiTestComponent: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 연결 테스트
   */
  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      console.log('🔥 API 테스트 시작');
      console.log('🌐 BASE_URL:', API_CONFIG.BASE_URL);
      console.log('📍 ENDPOINT:', API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES);
      
      const fullUrl = apiHelpers.getFullUrl(`${API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES}/recent/`);
      console.log('🎯 전체 URL:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      console.log('📡 응답 상태:', response.status);
      console.log('🌍 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 응답 데이터:', data);
      
      setTestResult({
        status: response.status,
        dataCount: data.length,
        data: data,
        url: fullUrl
      });

    } catch (err) {
      console.error('❌ API 테스트 실패:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 자동 테스트
  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔧 API 연결 테스트
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>기본 URL:</strong> {API_CONFIG.BASE_URL}
          </Typography>
          <Typography variant="body2">
            <strong>엔드포인트:</strong> {API_CONFIG.ENDPOINTS.OUTREACH_INQUIRIES}/recent/
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          onClick={testApiConnection}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? '테스트 중...' : 'API 테스트 재실행'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>오류:</strong> {error}
          </Alert>
        )}

        {testResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>성공!</strong> 상태 코드: {testResult.status}
            </Typography>
            <Typography variant="body2">
              <strong>데이터 개수:</strong> {testResult.dataCount}개
            </Typography>
            <Typography variant="body2">
              <strong>URL:</strong> {testResult.url}
            </Typography>
          </Alert>
        )}

        {testResult && testResult.data && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              📋 받은 데이터 (첫 번째 항목):
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                fontSize: '0.8rem', 
                backgroundColor: '#f5f5f5', 
                p: 1, 
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '200px'
              }}
            >
              {JSON.stringify(testResult.data[0], null, 2)}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTestComponent; 
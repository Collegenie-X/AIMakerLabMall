import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import { UserProvider } from "@/contexts/UserContext";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Maker Lab",
  description: "AI Maker Lab - 중·고등학생을 위한 AI 교육 플랫폼",
};

/**
 * 루트 레이아웃 컴포넌트
 * - 고정 헤더를 위한 레이아웃 구조 제공
 * - 메인 콘텐츠가 헤더에 가려지지 않도록 처리
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeRegistry>
          <UserProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  pt: 0, // Header에서 스페이서로 처리함
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

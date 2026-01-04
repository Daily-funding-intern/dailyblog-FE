"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8000";
const LOGIN_URL = "http://localhost:8000/admin/login/?next=/admin/";

interface UseAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onAuthSuccess?: () => void;
  onAuthFail?: () => void;
}

export function useAuth(options: UseAuthOptions = {}) {
  const {
    redirectTo = LOGIN_URL,
    requireAuth = true,
    onAuthSuccess,
    onAuthFail,
  } = options;

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false); // 중복 확인 방지

  useEffect(() => {
    // 인증이 필요없거나 이미 체크했다면 스킵
    if (!requireAuth || hasChecked) {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [requireAuth, hasChecked]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-auth/`, {
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setHasChecked(true);
        onAuthSuccess?.();
      } else {
        setIsAuthenticated(false);
        setHasChecked(true);
        onAuthFail?.();

        alert("로그인이 필요합니다.");
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error("인증 확인 실패:", error);
      setIsAuthenticated(false);
      setHasChecked(true);
      onAuthFail?.();
      alert("로그인이 필요합니다.");
      window.location.href = redirectTo;
    } finally {
      setIsLoading(false);
    }
  };

  return { isAuthenticated, isLoading, checkAuth };
}

// API 요청 유틸리티 - 인증 체크를 중앙화

const API_BASE_URL = "http://127.0.0.1:8000";
const LOGIN_URL = "http://127.0.0.1:8000/admin/login/?next=/admin/";

/**
 * 인증이 필요한 API 요청을 처리하는 함수
 * - 자동으로 쿠키 포함
 * - 401/403 에러 시 자동으로 로그인 페이지로 리다이렉트
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    credentials: "include", // 모든 요청에 쿠키 자동 포함
  });

  // 401 또는 403 에러 처리
  if (response.status === 401 || response.status === 403) {
    alert("로그인이 필요합니다.");
    window.location.href = LOGIN_URL;
    throw new Error("Unauthorized");
  }

  return response;
}

/**
 * GET 요청 헬퍼
 */
export async function apiGet(endpoint: string) {
  const response = await fetchWithAuth(endpoint);
  return response.json();
}

/**
 * POST 요청 헬퍼
 */
export async function apiPost(endpoint: string, data: any) {
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * PUT 요청 헬퍼
 */
export async function apiPut(endpoint: string, data: any) {
  const response = await fetchWithAuth(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * DELETE 요청 헬퍼
 */
export async function apiDelete(endpoint: string) {
  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
  });
  return response;
}

/**
 * 파일 업로드 헬퍼
 */
export async function apiUploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth("/api/uploadfile/", {
    method: "POST",
    body: formData,
  });

  return response.json();
}

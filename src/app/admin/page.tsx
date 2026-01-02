"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { isLoading } = useAuth({
    requireAuth: true,
    onAuthSuccess: () => {
      // 인증 성공 시
      router.push("/admin/post");
    },
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>리다이렉트 중...</p>
      </div>
    );
  }

  return null;
}

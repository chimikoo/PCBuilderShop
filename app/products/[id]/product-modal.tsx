"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") router.back();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
          onClick={() => router.back()}
          aria-label="Close"
        >
          ×
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

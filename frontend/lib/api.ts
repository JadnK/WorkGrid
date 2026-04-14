const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch backend health status");
  }

  return response.json();
}

export async function getBoards() {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch boards");
  }

  return response.json();
}
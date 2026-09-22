import { Box } from "../types/box";

const API_URL = process.env.API_URL;

export async function getBoxes(): Promise<Box[]> {
  const response = await fetch(`${API_URL}/box`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch boxes");
  }

  return response.json();
}

export async function getBoxById(id: number): Promise<Box> {
  const response = await fetch(`${API_URL}/box/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch box");
  }

  return response.json();
}

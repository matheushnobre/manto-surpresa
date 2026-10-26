
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendEmail(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to send e-mail");
  }
}

export async function verifyCode(email: string, code: string): Promise<void> {
  const response = await fetch(`${API_URL}/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    let message = "Não foi possível verificar o código";
    try {
      const data: unknown = await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "detail" in data &&
        typeof data.detail === "string"
      ) {
        message = data.detail;
      }
    } catch {
      // A resposta não contém JSON válido.
    }

    throw new Error(message);
  }
}
export async function submitSubscribe(email: string): Promise<void> {
  const cleaned = email.trim().toLowerCase();
  if (!cleaned || !cleaned.includes("@")) {
    throw new Error("Invalid email");
  }

  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: cleaned }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Subscription failed");
  }
}

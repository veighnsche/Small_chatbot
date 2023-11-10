import { User } from "firebase/auth";

type FetchOptions<B> = {
  method: string;
  path: string;
  body?: B;
};

export type Wretch = (path: string) => {
  get: () => Promise<ReadableStream<Uint8Array>>;
  post: <B>(body?: B) => Promise<ReadableStream<Uint8Array>>;
  delete: () => Promise<ReadableStream<Uint8Array>>;
};

export const configureWretch = ({ url, user }: { url: string; user: User }): Wretch => {
  const fetchWithAuth = async <B>({ method, path, body }: FetchOptions<B>) => {
    const token = await user.getIdToken(true);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    const trimmedUrl = url.replace(/\/$/, "");
    const trimmedPath = path.replace(/^\//, "");

    const res = await fetch(`${trimmedUrl}/api/v1/${trimmedPath}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.ok) {
      if (res.body === null) {
        throw new Error("Failed to send message");
      }
      return res.body;
    } else {
      throw new Error(`${res.status}: Failed to send message`);
    }
  };

  return (path: string) => ({
    get: () => fetchWithAuth({ method: "GET", path }),
    post: <B>(body?: B) => fetchWithAuth({ method: "POST", path, body }),
    delete: () => fetchWithAuth({ method: "DELETE", path }),
  });
};

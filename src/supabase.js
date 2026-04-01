const SUPABASE_URL = "https://ooniaxwbnwtsjfopqdkb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbmlheHdibnd0c2pmb3BxZGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjAzMzMsImV4cCI6MjA5MDUzNjMzM30.DrUMLAlJuEsSds50vv4vZzf-crFbl5gV_cb_BR97Xnk";

let accessToken = null;

export function setToken(token) {
  accessToken = token;
}

export function getToken() {
  return accessToken;
}

export async function sbFetch(path, options = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (options.prefer) headers["Prefer"] = options.prefer;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function sbAuth(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Неверный email или пароль");
  const data = await res.json();
  accessToken = data.access_token;
  return data;
}

export async function sbSignUp(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.message || "Ошибка регистрации");
  }
  return await res.json();
}

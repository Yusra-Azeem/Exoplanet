import axios from "axios"

// In dev, Vite proxies /api → http://localhost:8000
// In prod, set VITE_API_URL=https://your-railway-app.railway.app
const BASE = import.meta.env.VITE_API_URL ?? "/api"

const client = axios.create({ baseURL: BASE })

export async function predictPlanet(values) {
  const { data } = await client.post("/predict", values)
  return data
}

export async function fetchHealth() {
  const { data } = await client.get("/health")
  return data
}

import axios from "axios"



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

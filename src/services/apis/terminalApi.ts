import axios from "axios"

export const terminalApi = axios.create({
  baseURL: 'http://localhost:3002/terminal',
  headers: {
    'Content-Type': 'application/json',
  },
})
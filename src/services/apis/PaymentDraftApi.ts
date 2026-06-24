
import axios from 'axios'

export const paymentDraft = axios.create({
  baseURL: 'http://localhost:3002/payment-drafts',
  headers: {
    'Content-Type': 'application/json',
  },
})

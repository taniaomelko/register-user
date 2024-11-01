import { http, HttpResponse } from 'msw';

const apiUrl =
  import.meta.env.MODE === "production"
    ? `${import.meta.env.VITE_API_BASE_URL}`
    : "http://localhost:5173";

export const handlers = [
  http.post(apiUrl, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

import { http, HttpResponse } from 'msw';

const apiUrl = process.env.NODE_ENV === "production"
  ? `${process.env.PUBLIC_URL}/register-user`
  : "http://localhost:5173";

export const handlers = [
  http.post(apiUrl, () => {
    return new HttpResponse(null, { status: 200 })
  }),
];

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API = `http://localhost:${process.env.PORT ?? 5050}`;

export default defineConfig({
  plugins: [react()],
  server: {
    // Send API requests to the Express server started with `npm run server`.
    proxy: {
      '/upload-answer-key': API,
      '/upload-student-submissions': API,
    },
  },
});

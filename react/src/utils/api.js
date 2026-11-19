// Calls to the Gradient API. In development Vite forwards these paths to the server
// (see vite.config.js), so the app never needs to know the server's address.

async function postFiles(path, formData) {
  try {
    const response = await fetch(path, { method: 'POST', body: formData });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: body.error ?? `The server answered ${response.status}.` };
    }
    return body;
  } catch {
    return { success: false, error: 'Could not reach the server. Is `npm run server` running?' };
  }
}

export function uploadAnswerKey(file) {
  const formData = new FormData();
  formData.append('file', file);
  return postFiles('/upload-answer-key', formData);
}

export function uploadStudentSubmissions(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return postFiles('/upload-student-submissions', formData);
}

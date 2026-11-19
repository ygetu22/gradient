import { useState } from 'react';
import './App.css';
import FilePicker from './components/FilePicker';
import Loading from './components/Loading';
import MessageDisplay from './components/MessageDisplay';
import { uploadAnswerKey, uploadStudentSubmissions } from './utils/api';

// Two steps: upload the answer key, then upload the students' work.
function App() {
  const [loading, setLoading] = useState(false);
  const [hasAnswerKey, setHasAnswerKey] = useState(false);
  const [message, setMessage] = useState(null);

  async function runUpload(upload, successText) {
    setLoading(true);
    setMessage(null);
    const response = await upload();
    setLoading(false);

    if (response.success) {
      setMessage({ type: 'success', text: successText });
    } else {
      setMessage({ type: 'error', text: response.error });
    }
    return response.success;
  }

  async function handleAnswerKey([file]) {
    const uploaded = await runUpload(() => uploadAnswerKey(file), 'Answer key uploaded.');
    if (uploaded) setHasAnswerKey(true);
  }

  function handleSubmissions(files) {
    runUpload(() => uploadStudentSubmissions(files), 'Student work uploaded.');
  }

  return (
    <div className="App">
      <h1>Gradient</h1>

      {loading && <Loading />}
      {message && <MessageDisplay message={message.text} type={message.type} />}

      {!loading && !hasAnswerKey && (
        <FilePicker title="Upload the answer key" buttonLabel="Upload answer key" onUpload={handleAnswerKey} />
      )}
      {!loading && hasAnswerKey && (
        <FilePicker
          title="Upload student work"
          buttonLabel="Upload submissions"
          multiple
          onUpload={handleSubmissions}
        />
      )}
    </div>
  );
}

export default App;

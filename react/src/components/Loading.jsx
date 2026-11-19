import './loading.css';

function Loading() {
  return (
    <div className="loading-container" role="status">
      <div className="spinner" aria-hidden="true"></div>
      <h3>Uploading…</h3>
    </div>
  );
}

export default Loading;

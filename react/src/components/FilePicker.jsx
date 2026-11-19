import PropTypes from 'prop-types';
import { useState } from 'react';

// A heading, a file input and a button. Hands the chosen files to `onUpload`;
// the App does the uploading, so each file is sent once.
function FilePicker({ title, buttonLabel, multiple, onUpload }) {
  const [files, setFiles] = useState([]);

  return (
    <div>
      <h2>{title}</h2>
      <input
        type="file"
        accept="application/pdf"
        multiple={multiple}
        aria-label={title}
        onChange={(event) => setFiles([...event.target.files])}
      />
      <button type="button" disabled={files.length === 0} onClick={() => onUpload(files)}>
        {buttonLabel}
      </button>
    </div>
  );
}

FilePicker.propTypes = {
  title: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
};

export default FilePicker;

import PropTypes from 'prop-types';

function MessageDisplay({ message, type }) {
  return (
    <div role={type === 'error' ? 'alert' : 'status'} style={{ color: type === 'error' ? 'red' : 'green', marginTop: 20 }}>
      {message}
    </div>
  );
}

MessageDisplay.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success']).isRequired,
};

export default MessageDisplay;

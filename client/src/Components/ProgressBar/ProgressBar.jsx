import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressBars() {
  const now = 60;
  return <ProgressBar now={now} label={`${now}%`} />;
}

export default ProgressBars;
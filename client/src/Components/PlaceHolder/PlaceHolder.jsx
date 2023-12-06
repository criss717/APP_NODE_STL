import Placeholder from 'react-bootstrap/Placeholder';

function Placeholders() {
  return (
    <>
      <Placeholder as="p" animation="glow" style={{ position: 'relative', top: 50, left: 0, width: '100%',color: '#9BD430' }}>
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="wave" style={{ position: 'relative', top: 50, left: 0, width: '100%',color: '#9BD430' }}>
        <Placeholder xs={12} />
      </Placeholder>
    </>
  );
}

export default Placeholders;
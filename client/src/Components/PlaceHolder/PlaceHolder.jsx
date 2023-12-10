import Placeholder from 'react-bootstrap/Placeholder';

function Placeholders() {
  return (
    <>
      <Placeholder as="p" animation="glow" style={{ position: 'relative', top: 50, left: 0, width: '100%',color: '#ffc600' }}>
        <Placeholder xs={12} />
        <Placeholder xs={12} />
        <Placeholder xs={12} />
        <Placeholder xs={12} />
        <Placeholder xs={12} />
      </Placeholder>      
    </>
  );
}

export default Placeholders;
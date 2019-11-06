import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

const FindingPlayer = React.memo(() => {
  return (
    <>
      <div
        className="all-centered"
        style={{
          paddingBottom: '150px',
          fontSize: '48px'
        }}
      >
        Đang tìm người chơi
      </div>

      <div className="all-centered">
        <PulseLoader size={50} color="#dea724" />
      </div>
    </>
  );
});
export default FindingPlayer;

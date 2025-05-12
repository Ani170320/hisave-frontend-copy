import React from 'react';

const HSpacer = ({ space }) => (
  <div style={{ width: space, display: 'inline-block' }}></div>
);

const LoadingEarnings = () => {
  return (
    <div className="text-center">
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '100%' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <HSpacer space="1rem" />
        <p className="h5 fw-semibold text-secondary mb-0">Loading earnings...</p>
      </div>
    </div>
  );
};

export default LoadingEarnings;

import React from 'react';
import Preloader from './Preloader';

export default function LoadingScreen({ onComplete }) {
  return (
    <Preloader
      projectName="WEPROVISION INFOTECH"
      onComplete={onComplete}
      duration={2800}
    />
  );
}
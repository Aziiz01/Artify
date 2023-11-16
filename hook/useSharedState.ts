import React, { useState } from 'react';

const useSharedState = () => {
  const [selectedStyle, setSelectedStyle] = useState('');

  return {
    selectedStyle,
    setSelectedStyle,
  };
};

export default useSharedState;

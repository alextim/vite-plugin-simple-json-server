import React, { useState } from 'react';

const useNameInput = (initialValue = '') => {
  const [name, setName] = useState(initialValue);

  const reset = () => {
    setName(initialValue);
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setName(value);
  };

  return { name, reset, onChange };
};

export default useNameInput;

import { useEffect } from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement>, onClickOutside: () => void) => {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener('mousedown', handleClickOutside);
    return () => void document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, onClickOutside]);
};

export default useClickOutside;

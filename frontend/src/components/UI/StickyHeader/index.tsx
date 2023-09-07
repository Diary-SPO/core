import {
  FC, ReactNode, useEffect, useRef, useState,
} from 'react';
import { usePlatform } from '@vkontakte/vkui';

import './styles.css';

interface IStickyHeader {
  children: ReactNode;
}

const StickyHeader: FC<IStickyHeader> = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const header = useRef<HTMLElement | null>(null);

  const platform = usePlatform();
  const isVKCom = platform === 'vkcom';

  function handleScroll() {
    if (header.current) {
      const stickyThreshold = 200;
      const currentPosition = window.scrollY;

      if (currentPosition >= stickyThreshold) {
        setIsSticky(true);
      } else if (currentPosition < stickyThreshold) {
        setIsSticky(false);
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={header}
      style={{ marginTop: !isVKCom ? 50 : undefined }}
      className={isSticky ? 'sticky content' : undefined}
    >
      {children}
    </header>
  );
};

export default StickyHeader;

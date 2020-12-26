import { useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

function useWebsocket(url: string) {
  const socket = useRef<Socket>();
  useEffect(() => {
    socket.current = io(url);
    return () => {
      socket.current?.disconnect();
    };
  }, []);
  return socket;
}

export default useWebsocket;

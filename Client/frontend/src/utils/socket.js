import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

let socket = null;

/**
 * Returns an initialised Socket.IO socket singleton.
 * Connects to the backend (port 5000 in dev).
 */
export function getSocket() {
    if (!socket) {
        socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            autoConnect: false,
        });
    }
    return socket;
}

/**
 * useSocket – lightweight hook that connects the socket, joins
 * the user's personal room, and tears down on unmount.
 *
 * @param {string} userId – the logged-in user's _id
 */
export function useSocket(userId) {
    const socketRef = useRef(getSocket());

    useEffect(() => {
        const s = socketRef.current;
        if (!userId) return;

        if (!s.connected) s.connect();

        s.emit('join', userId);

        return () => {
            // Don't disconnect – keep alive for the session
        };
    }, [userId]);

    return socketRef.current;
}

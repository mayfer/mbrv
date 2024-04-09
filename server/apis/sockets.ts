import { SocketTester } from 'shared/types';

export async function setup_sockets(io) {
    io.on('connection', (socket) => {
        let counter = 0;

        socket.on('disconnect', () => {
        });

        setInterval(() => {
            socket.emit('test', { counter: counter++ } as SocketTester);
        }, 500);
    });
}
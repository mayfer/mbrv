import { SocketTester } from 'shared/types';

export async function setup_sockets(io) {
    io.on('connection', (socket) => {
        let counter = 0;
        console.log('socket user connected: ', socket.id);
        socket.on('disconnect', () => {
            console.log('socket user disconnected: ', socket.id);
        });

        setInterval(() => {
            socket.emit('test', { counter: counter++ } as SocketTester);
        }, 500);
    });
}
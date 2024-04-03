export async function setup_sockets(io) {
    io.on('connection', (socket) => {
        console.log('socket user connected: ', socket.id);
        socket.on('disconnect', () => {
            console.log('socket user disconnected: ', socket.id);
        });
    });
}
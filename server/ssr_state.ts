import { Greeting } from 'shared/types';
import { MainProps } from 'shared/main_props';

export async function getMainProps(req) {
    const server_hostname = require('os').hostname();
    return {
        greeting: { text: `Hello from server, it is currently ${new Date().toLocaleTimeString()}` } as Greeting,
    } as MainProps;
}
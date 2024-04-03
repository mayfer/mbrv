import { Greeting } from 'shared/types';
import { MainProps } from 'shared/main_props';

export async function getMainProps(req) {
function formatDateTime(date) {
    const pad = (num) => num.toString().padStart(2, '0');
    const msPad = (num) => num.toString().padStart(3, '0');
    
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${msPad(date.getMilliseconds())}`;
    }
    
    const formattedDate = formatDateTime(new Date());

    return {
        greeting: { text: `Hello from server ${formattedDate}` } as Greeting,
    } as MainProps;
}
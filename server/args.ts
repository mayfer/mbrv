import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .option('port', {
        default: 4002,
        describe: 'Server port'
    })
    .option('mode', {
        default: 'development',
        describe: 'Server mode (development or production)'
    })
    .argv;

export default argv as Record<string, any>;
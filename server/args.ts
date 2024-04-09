import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .option('port', {
        default: 4000,
        type: 'number',
        describe: 'Server port'
    })
    .option('mode', {
        default: 'development',
        describe: 'Server mode',
        choices: ['development', 'production']
    })
    .option('ssr', {
        default: true,
        type: 'boolean',
        describe: 'Enable server-side rendering.\n  *CSS SSR requires mode=production'
    })
    .argv;

console.log('Running with args:');
for (const [key, value] of Object.entries(argv)) {
    if (key !== '_' && key !== '$0') {
        console.log(`  --${key} ${value}`);
    }
}

export default argv as Record<string, any>;

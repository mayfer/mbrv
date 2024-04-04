import fs from 'fs';
import path from 'path';

export type Credentials = {
    [key: string]: any;
};

// Credentials files that are needed will be auto-generated in this folder when you run the app.
// You can edit them as needed.
export default function getCredentials(namespace: String, defaults: Credentials = {}): Credentials {
    const current_file_dir = __dirname;
    const filename = path.join(current_file_dir, `${namespace}.json`);
    const file_exists = fs.existsSync(filename);

    let credentials: Credentials = {};

    if (file_exists) {
        const file_contents = fs.readFileSync(filename);

        try {
            credentials = JSON.parse(file_contents.toString()) as Credentials;
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error(`** Error parsing credentials file: ${filename}`);
                console.error(e);
                return {};
            }
        }
    }

    const handler: ProxyHandler<Credentials> = {
        get(target: Credentials, prop: string, receiver: any): any {
            if (target[prop] === undefined) {
                if(defaults[prop] !== undefined) {
                    console.log(`*** Using default credential: "${prop}" in ${filename}`);
                    target[prop] = defaults[prop];
                } else {
                    console.log(`*** Missing credential: "${prop}" in ${filename}`);
                    target[prop] = "";
                }
                fs.writeFileSync(filename, JSON.stringify(credentials, null, 4));
            }
            return Reflect.get(target, prop, receiver);
        },
    };
    const proxy: Credentials = new Proxy(credentials, handler);

    return proxy;
}

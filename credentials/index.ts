import fs from 'fs';
import path from 'path';

export default function getCredentials(namespace: String, key: string, defaultValue?: string): string {
    const current_file_dir = __dirname;
    const filename = path.join(current_file_dir, `${namespace}.json`);
    const file_exists = fs.existsSync(filename);
    if(file_exists) {
        const file_contents = fs.readFileSync(filename);
        let credentials: Record<string, string> = {};
        try {
            credentials = JSON.parse(file_contents.toString()) as Record<string, string>;
        } catch(e) {
            if(e instanceof SyntaxError) {
                console.error(`** Error parsing credentials file: ${filename}`);
                console.error(e);
                return defaultValue;
            }
        }
        if(credentials[key] === undefined) {
            console.error(`** Error: missing key ${key} in credentials file, please edit: ${filename}`);
            credentials[key] = defaultValue ?? "";
            fs.writeFileSync(filename, JSON.stringify(credentials, null, 4));
        }
        return credentials[key]
    } else {
        console.warn("** Auto-creating missing credentials file, please edit:", filename);
        fs.writeFileSync(filename, JSON.stringify({key: ""}, null, 4));
        return defaultValue;
    }
}
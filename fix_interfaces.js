import fs from 'fs';
import path from 'path';

const srcDir = './src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix empty interfaces: interface Props {} -> type Props = Record<string, unknown>;
    const emptyInterfacePattern = /interface\s+(\w+)\s*\{\}/g;
    if (emptyInterfacePattern.test(content)) {
        content = content.replace(emptyInterfacePattern, "type $1 = Record<string, unknown>");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed empty interface in ${file}`);
    }
});

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

    // 1. Replace 'import React from "react"' with 'import * as React from "react"'
    const simpleImportPattern = /import React from ['"]react['"]/g;
    if (simpleImportPattern.test(content)) {
        content = content.replace(simpleImportPattern, "import * as React from 'react'");
        changed = true;
    }

    // 2. Replace 'import React, { ... } from "react"' with named imports
    const namedImportMatch = content.match(/import React,\s*(\{[^}]+\})\s*from\s*['"]react['"]/);
    if (namedImportMatch) {
        const namedImports = namedImportMatch[1];
        content = content.replace(namedImportMatch[0], `import * as React from 'react';\nimport ${namedImports} from 'react'`);
        changed = true;
    }

    // 3. Fix empty interfaces: interface Props {} -> type Props = object;
    const emptyInterfaceMatch = content.match(/interface\s+(\w+)\s*\{\}/g);
    if (emptyInterfaceMatch) {
        emptyInterfaceMatch.forEach(m => {
            const nameMatch = m.match(/interface\s+(\w+)/);
            if (nameMatch) {
                const name = nameMatch[1];
                content = content.replace(m, `type ${name} = object`);
                changed = true;
            }
        });
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

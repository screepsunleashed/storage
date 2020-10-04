/**
 * This file copies the required files into the dist directory
*/

import { readFileSync, writeFileSync, copyFileSync } from 'fs';

// Read package json and remove the unneeded values
const pkg = JSON.parse(readFileSync('./package.json').toString());
delete pkg['scripts'];
delete pkg['devDependencies'];

writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 4));
copyFileSync('./LICENSE', './dist/LICENSE');
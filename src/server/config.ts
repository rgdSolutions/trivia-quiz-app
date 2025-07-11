import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
const PackageJson = JSON.parse(rawPackageJson);
const { version: VERSION } = PackageJson;

const SERVER_PORT = process.env.PORT || 3000;

export { IS_DEV, VERSION, SERVER_PORT };

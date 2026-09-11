import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const rl = createInterface({ input: stdin, output: stdout });
const password = await rl.question('Admin-Passwort eingeben: ');
rl.close();

if (!password) {
	console.error('Kein Passwort eingegeben.');
	process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');

console.log('\nIn .env (lokal) bzw. als Vercel-Umgebungsvariable eintragen:\n');
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}\n`);

import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

async function* search(dir, pattern) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* search(res, pattern);
    } else if (pattern.test(res)) {
      yield res;
    }
  }
}

async function run() {
  const browser = await puppeteer.launch({args: [
    '--disable-notifications',
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]});
	const page = await browser.newPage();
	const filename = path.resolve('./somefile.html');
	await page.goto('file://' + filename).catch(e => console.log(`Error: ${filename} not loading\n${e.message}`));
	const image = await page.$('img[src="images/c0d8e001-040c-11ec-878e-957e4413b910.png"]');
	const coordinates = await image.boundingBox();
	console.log(coordinates);
	await browser.close();
}

run();

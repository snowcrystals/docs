import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const pkg = req.query.package as string;
	const version = req.query.version as string;

	try {
		const pkgDirPath = join(process.cwd(), "docs", pkg);
		const docs = await readFile(join(pkgDirPath, `${version}.json`));
		res.setHeader("Content-Type", "application/json").setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000").send(docs);
	} catch {
		res.status(404).end();
	}
}

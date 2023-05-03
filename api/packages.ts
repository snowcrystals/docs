import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const docsDirPath = join(process.cwd(), "docs");
		const packages = await readdir(docsDirPath);

		res.setHeader("Content-Type", "application/json").setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000").send(packages);
	} catch {
		res.status(404).end();
	}
}

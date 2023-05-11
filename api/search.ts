import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ProjectParser } from "typedoc-json-parser";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const pkg = req.query.package as string;
	const version = req.query.version as string;
	const query = req.query.query as string;

	try {
		const pkgDirPath = join(process.cwd(), "docs", pkg);
		const docs = await readFile(join(pkgDirPath, `${version}.json`), "utf-8");

		const parser = new ProjectParser({ data: JSON.parse(docs) });
		const results = parser.search(query);
		res.setHeader("Content-Type", "application/json").setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000").send(results);
	} catch {
		res.status(404).end();
	}
}

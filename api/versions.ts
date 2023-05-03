import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const pkg = req.query.package as string;

	try {
		// Check if package exists
		const docsDirPath = join(process.cwd(), "docs");
		const packages = await readdir(docsDirPath);
		if (!packages.includes(pkg)) throw new Error();

		const versionsFileList = await readdir(join(docsDirPath, pkg));
		const versions = versionsFileList.filter((file) => file.endsWith(".json")).map((file) => file.slice(0, -5));

		res.setHeader("Content-Type", "application/json").setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000").send(versions);
	} catch {
		res.status(404).end();
	}
}

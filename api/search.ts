import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
	ClassParser,
	EnumParser,
	FunctionParser,
	InterfaceParser,
	NamespaceParser,
	ProjectParser,
	TypeAliasParser,
	VariableParser
} from "typedoc-json-parser";

function getType(result: any): "classes" | "enums" | "variables" | "typeAliases" | "interfaces" | "functions" | "namespaces" {
	if (result instanceof ClassParser) return "classes";
	else if (result instanceof EnumParser) return "enums";
	else if (result instanceof VariableParser) return "variables";
	else if (result instanceof TypeAliasParser) return "typeAliases";
	else if (result instanceof InterfaceParser) return "interfaces";
	else if (result instanceof FunctionParser) return "functions";
	else if (result instanceof NamespaceParser) return "namespaces";

	return "typeAliases";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const pkg = req.query.package as string;
	const version = req.query.version as string;
	const query = req.query.query as string;

	try {
		const pkgDirPath = join(process.cwd(), "docs", pkg);
		const docs = await readFile(join(pkgDirPath, `${version}.json`), "utf-8");

		const parser = new ProjectParser({ data: JSON.parse(docs) });
		const results = parser.search(query);

		const parsed = results.map((result) => ({ ...result.toJSON(), type: getType(result) }));
		res.setHeader("Content-Type", "application/json").setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000").send(parsed);
	} catch {
		res.status(404).end();
	}
}

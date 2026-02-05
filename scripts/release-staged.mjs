import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packages = {
	core: "@marckrenn/pi-sub-core",
	shared: "@marckrenn/pi-sub-shared",
	bar: "@marckrenn/pi-sub-bar",
};

const version = JSON.parse(readFileSync("packages/sub-core/package.json", "utf8")).version;

function run(command) {
	execSync(command, { stdio: "inherit" });
}

function runQuiet(command) {
	execSync(command, { stdio: "ignore" });
}

async function waitForPackage(name, { timeoutMs = 120_000, intervalMs = 5_000 } = {}) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			runQuiet(`npm view ${name}@${version} version`);
			console.log(`Verified ${name}@${version} on npm.`);
			return;
		} catch {
			console.log(`Waiting for ${name}@${version} to appear on npm...`);
		}
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}
	throw new Error(`Timed out waiting for ${name}@${version} to appear on npm.`);
}

function publish(ignore) {
	const ignoreArgs = ignore.flatMap((name) => ["--ignore", name]).join(" ");
	const command = ignoreArgs ? `npx changeset publish ${ignoreArgs}` : "npx changeset publish";
	run(command);
}

publish([packages.bar]);
await waitForPackage(packages.core);
await waitForPackage(packages.shared);
publish([packages.core, packages.shared]);

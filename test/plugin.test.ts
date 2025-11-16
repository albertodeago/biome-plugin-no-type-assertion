import assert from "node:assert";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type BiomeErrorOutput = null | {
	summary: {
		changed: number;
		unchanged: number;
		matches: number;
		duration: { secs: number; nanos: number };
		scannerDuration: { secs: number; nanos: number };
		errors: number;
		warnings: number;
		infos: number;
		skipped: number;
		suggestedFixesSkipped: number;
		diagnosticsNotPrinted: number;
	};
	diagnostics: [
		{
			category: string;
			severity: "debug" | "info" | "warning" | "error";
			description: string;
			message: [
				{
					elements: Array<unknown>;
					content: string;
				},
			];
			advices: { advices: Array<unknown> };
			verboseAdvices: { advices: Array<unknown> };
			location: {
				path: { file: string };
				span: [number, number];
				sourceCode: string;
			};
			tags: [];
			source: null;
		},
	];
	command: string;
};

type BiomeError = {
	status: number;
	output: Array<null | string>; // strings inside the array can be a stringify of Array<BiomeErrorOutput>;
	stdout: string;
	stderr: string;
};

function execBiome(fixtureFile: "01" | "02") {
	const fixturePath = join(__dirname, "fixtures", `${fixtureFile}.ts`);
	const biomeConfigPath = "./test/biome.config.jsonc";

	execSync(
		`npx @biomejs/biome check --config-path=${biomeConfigPath} --reporter=json ${fixturePath}`,
		{ encoding: "utf-8", stdio: "pipe" },
	);
}

function getValidOutputs(biomeOutput: BiomeError["output"]) {
	const validOutputs: BiomeErrorOutput[] = biomeOutput
		.map((o: string | null) => {
			if (o === null) return null;
			try {
				return JSON.parse(o);
			} catch (_e) {
				return null;
			}
		})
		.filter(Boolean);
	return validOutputs;
}

describe("no-type-assertion plugin", () => {
	it("detects type assertion such as $expr as $type (e.g. 'const a = 5 as number;')", () => {
		try {
			execBiome("01");

			// If we get here, no error was thrown - test should fail
			expect.fail("Expected biome to report an error for type assertion");
		} catch (error: unknown) {
			// We cast because that's the expected error type. If it's different the test will fail anyway
			const biomeError = error as BiomeError;
			expect(biomeError.output.length).toBeGreaterThan(0);

			const validOutputs = getValidOutputs(biomeError.output);
			const output = validOutputs[0];
			assert(output !== null);

			const pluginError = output.diagnostics.find(
				(diag) => diag.category === "plugin",
			);
			assert(pluginError !== undefined);

			expect(pluginError.description).toContain(
				"Avoid type assertions. Use type guards or proper typing instead.",
			);
			expect(pluginError.location.sourceCode).toContain(
				"const a = 5 as number;",
			);
		}
	});

	it("doesn't detect `as const` as an invalid type assertion", () => {
		try {
			execBiome("02");

			// We want to reach here, so no error should be thrown
			expect(true).toBe(true);
		} catch (_error: unknown) {
			console.log(_error);
			expect.fail("Did not expect biome to report an error for 'as const'");
		}
	});
});

import test from "node:test";
import assert from "node:assert/strict";
import { createEventBus, type ExtensionAPI, type ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { SubCoreState, UsageSnapshot } from "@marckrenn/pi-sub-shared";
import createExtension from "../index.js";

type FakePi = ExtensionAPI & {
	emitEvent: (event: string, ctx: ExtensionContext) => Promise<void>;
};

function buildUsage(overrides?: Partial<UsageSnapshot>): UsageSnapshot {
	return {
		provider: "anthropic",
		displayName: "Anthropic (Claude)",
		windows: [{ label: "Week", usedPercent: 14, resetDescription: "5d7h left" }],
		...overrides,
	};
}

function registerCurrentStateReply(pi: FakePi, state: SubCoreState): void {
	pi.events.on("sub-core:request", (payload) => {
		const request = payload as { reply: (payload: { state: SubCoreState }) => void };
		request.reply({ state });
	});
}

function createFakePi(): FakePi {
	const handlers = new Map<string, Array<(event: unknown, ctx: ExtensionContext) => unknown>>();
	const pi = {
		events: createEventBus(),
		on(event: string, handler: (event: unknown, ctx: ExtensionContext) => unknown) {
			const current = handlers.get(event) ?? [];
			current.push(handler);
			handlers.set(event, current);
		},
		async emitEvent(event: string, ctx: ExtensionContext) {
			for (const handler of handlers.get(event) ?? []) {
				await handler({ type: event }, ctx);
			}
		},
		registerCommand: () => {},
		registerTool: () => {},
		registerShortcut: () => {},
		registerFlag: () => {},
		getFlag: () => undefined,
		registerMessageRenderer: () => {},
		sendMessage: () => {},
		sendUserMessage: () => {},
		appendEntry: () => {},
		setSessionName: () => {},
		getSessionName: () => undefined,
		setLabel: () => {},
		exec: async () => ({ code: 0, stdout: "", stderr: "" }),
		getActiveTools: () => [],
		getAllTools: () => [],
		setActiveTools: () => {},
		setModel: async () => true,
		getThinkingLevel: () => "high",
		setThinkingLevel: () => {},
		registerProvider: () => {},
	} as unknown as FakePi;

	return pi;
}

test("widget render keeps working after the original context becomes stale", async () => {
	const pi = createFakePi();
	let stale = false;
	let widgetRendererFactory:
		| ((tui: unknown, theme: { fg: (token: string, text: string) => string }) => { render(width: number): string[] })
		| undefined;

	const ctx = {
		ui: {
			select: async () => undefined,
			confirm: async () => false,
			input: async () => undefined,
			notify: () => {},
			setStatus: () => {},
			setWorkingMessage: () => {},
			setWidget: (_key: string, renderer?: unknown) => {
				widgetRendererFactory = renderer as typeof widgetRendererFactory;
			},
			setFooter: () => {},
			setHeader: () => {},
			setTitle: () => {},
			custom: async () => undefined,
			setEditorText: () => {},
			get theme() {
				if (stale) {
					throw new Error(
						"This extension instance is stale after session replacement or reload. Use the provided replacement-session context instead.",
					);
				}
				return {
					fg: (_token: string, text: string) => text,
					bold: (text: string) => text,
					getBgAnsi: () => "\u001b[49m",
				};
			},
		},
		get hasUI() {
			if (stale) {
				throw new Error(
					"This extension instance is stale after session replacement or reload. Use the provided replacement-session context instead.",
				);
			}
			return true;
		},
		get cwd() {
			if (stale) {
				throw new Error(
					"This extension instance is stale after session replacement or reload. Use the provided replacement-session context instead.",
				);
			}
			return "/tmp/project";
		},
		sessionManager: {} as ExtensionContext["sessionManager"],
		modelRegistry: {} as ExtensionContext["modelRegistry"],
		model: { provider: "openai-codex", id: "gpt-5" },
		isIdle: () => true,
		abort: () => {},
		hasPendingMessages: () => false,
		shutdown: () => {},
		getContextUsage: () => ({ tokens: 10, contextWindow: 100, percent: 10 }),
		compact: () => {},
		getSystemPrompt: () => "",
	} as unknown as ExtensionContext;

	registerCurrentStateReply(pi, { usage: buildUsage() });
	createExtension(pi);
	await pi.emitEvent("session_start", ctx);
	pi.events.emit("sub-core:update-current", { state: { usage: buildUsage() } });

	assert.ok(widgetRendererFactory, "expected widget renderer to be registered");
	stale = true;

	const theme = {
		fg: (_token: string, text: string) => text,
		bold: (text: string) => text,
		getBgAnsi: () => "\u001b[49m",
	};
	assert.doesNotThrow(() => widgetRendererFactory?.({}, theme).render(80));
});

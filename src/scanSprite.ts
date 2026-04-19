import { ScratchSprite } from "./projectjson";

export interface ScanSpriteResults {
	extensions: Record<string, { amount: number }>;
	blocks: Record<string, { amount: number }>;
}

export function scanSprite(sprite: ScratchSprite) {
	const result: ScanSpriteResults = { extensions: {}, blocks: {} };

	for (const blockID in sprite.blocks) {
		const block = sprite.blocks[blockID];
		try {
			const { opcode } = block;

			const extensionName = opcode.split("_", 1)[0];

			if (!result.extensions[extensionName]) {
				result.extensions[extensionName] = {
					amount: 1
				};
			} else {
				result.extensions[extensionName].amount += 1;
			}

			if (!result.blocks[opcode]) {
				result.blocks[opcode] = {
					amount: 1
				};
			} else {
				result.blocks[opcode].amount += 1;
			}
		} catch (e) {
			console.warn(block, e, ", continuing.");
		}
	}

	return result;
}

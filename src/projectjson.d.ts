export default interface ScratchProjectJson {
	extensionURLs: Record<string, string>;
	extensions: string[];
	meta: {
		semver: string;
		vm: string;
		agent: string;
		platform: { name: string; url: string };
	};
	monitors: ScratchMonitor[];
	targets: ScratchSprite[];
}

export interface ScratchMonitor {
	id: string;
	mode: string;
	opcode: string;
	params: Record<string, string>;
	spriteName: string | null;
	value: string | number;
	visible: boolean;
	width: number;
	x: number;
	y: number;
}

export interface ScratchSprite {
	blocks: Record<string, ScratchBlock>;
	broadcasts: Record<string, unknown>;
	comments: Record<string, unknown /* a comment (not needed) */>;

	costumes: Record<string, unknown /* a custome (also not needed) */>;
	direction?: number;
	draggable?: boolean;
	currentCostume: number;

	isStage: boolean;
	layerOrder: number;
	lists: Record<string, unknown>;
	name: string;
	rotationStyle?: string;
	size?: number;
	sounds: Record<string, unknown>;
	tempo: number;
	textToSpeechLanguage: string | null;
	variables: Record<string, ScratchVariable>;
	videoState: string;
	videoTransparency: number;
	volume: number;
	x?: number;
	y?: number;
}

export interface ScratchBlock {
	fields: {};
	inputs: Record<string, unknown[]>;
	next: string;
	opcode: string;
	parent: string;
	shadow: boolean;
	topLevel: boolean;
}

export type ScratchVariable = [string, string | number]; /* [name, value] */

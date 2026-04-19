import JSZip, { JSZipObject } from "jszip";
import { getBinaryContent } from "jszip-utils";
import ScratchProjectJson from "./projectjson.js";
import { scanSprite, ScanSpriteResults } from "./scanSprite.js";

async function getZipFileData(url: string) {
	return new Promise<ArrayBuffer>((resolve) => {
		getBinaryContent(url, (err: Error | null, data: ArrayBuffer) => {
			if (err) throw err;

			resolve(data);
		});
	});
}

async function getProjectJson(data: ArrayBuffer) {
	const zip = new JSZip();
	const newZip: JSZip = await zip.loadAsync(data);

	const projectJson: JSZipObject = newZip.files["project.json"];
	const fileContents = await projectJson.async("string");

	return JSON.parse(fileContents) as ScratchProjectJson;
}

/**
 * Analyses the primary use of extensions in a scratch project
 * @param url - URL which the sb3 (as .zip) is at.
 */
export default async function analyseProject(url: string) {
	const binaryContent = await getZipFileData(url);

	const projectJson = await getProjectJson(binaryContent);

	console.debug(projectJson);
	const sprites = projectJson.targets;
	const results: ScanSpriteResults[] = [];

	for (const sprite of sprites) {
		results.push(scanSprite(sprite));
	}

	const finalResult: ScanSpriteResults & {
		totalBlocks: number;
		extensionNames: string[];
	} = {
		blocks: {},
		extensions: {},

		totalBlocks: 0,
		extensionNames: projectJson.extensions
	};
	const { blocks, extensions } = finalResult;

	for (const result of results) {
		for (const extensionName in result.extensions) {
			if (extensions[extensionName]) {
				extensions[extensionName].amount +=
					result.extensions[extensionName].amount;
			} else {
				extensions[extensionName] = {
					amount: Number(result.extensions[extensionName].amount)
				};
			}

			finalResult.totalBlocks += result.extensions[extensionName].amount;
		}

		for (const blockName in result.blocks) {
			if (blocks[blockName]) {
				blocks[blockName].amount += result.blocks[blockName].amount;
			} else {
				blocks[blockName] = {
					amount: Number(result.blocks[blockName].amount)
				};
			}
		}
	}

	return finalResult;
}

analyseProject("/old/index.sb3");

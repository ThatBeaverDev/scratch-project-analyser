import analyseProject from "./index.js";
import { Chart } from "chart.js/auto";

const input = document.getElementById("file") as HTMLInputElement;
input.type = "file";
input.accept = ".sb3, .zip";

function stringToColour(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}

	let color = "#";
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (8 * i)) & 0xff;
		color += ("00" + value.toString(16)).slice(-2);
	}

	return color;
}

input.addEventListener("change", async (e: Event) => {
	// @ts-expect-error // trust
	if (e.target.files[0]) {
		// @ts-expect-error // continue to trust
		const file: File = e.target.files[0];

		const fileURL = URL.createObjectURL(file);

		const analysis = await analyseProject(fileURL);

		const data = {
			labels: analysis.extensionNames,
			datasets: [
				{
					label: "Scratch Project Analysis",
					data: analysis.extensionNames.map(
						(item) => analysis.extensions[item].amount
					),
					backgroundColor: analysis.extensionNames.map((item) =>
						stringToColour(item)
					),
					hoverOffset: 4
				}
			]
		};

		const canvas = document.getElementById(
			"extensionPieChart"
		) as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		input.remove();
		canvas.style.display = "block";

		const sides = Math.min(window.innerWidth, window.innerHeight);
		canvas.style.width = `${sides}px`;
		canvas.style.height = `${sides}px`;

		new Chart(ctx, {
			type: "pie",
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "top"
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const label = context.label || "";
								const value = context.raw || 0;
								const total = context.dataset.data.reduce(
									(a, b) => a + b,
									0
								);
								const percentage = Math.round(
									// @ts-expect-error
									(value / total) * 100
								);
								return `${label}: ${value} (${percentage}%)`;
							}
						}
					},
					title: {
						display: true,
						text: file.name,
						position: "top"
					}
				}
			}
		});
	}
});

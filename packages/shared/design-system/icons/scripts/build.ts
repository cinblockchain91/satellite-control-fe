import { transform } from "@svgr/core";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const srcDir: string = join(__dirname, "../src");
const distReact: string = join(__dirname, "../dist/react");
const distRN: string = join(__dirname, "../dist/rn");
const distIOS: string = join(__dirname, "../dist/ios");
const distAndroid: string = join(__dirname, "../dist/android");

mkdirSync(distReact, { recursive: true });
mkdirSync(distRN, { recursive: true });
mkdirSync(distIOS, { recursive: true });

// Android density folders
const androidDensities = [
  { folder: "drawable-mdpi", scale: 1 },
  { folder: "drawable-hdpi", scale: 1.5 },
  { folder: "drawable-xhdpi", scale: 2 },
  { folder: "drawable-xxhdpi", scale: 3 },
  { folder: "drawable-xxxhdpi", scale: 4 },
];
androidDensities.forEach((d) =>
  mkdirSync(join(distAndroid, d.folder), { recursive: true }),
);

const toPascalCase = (str: string): string =>
  str.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());

const toSnakeCase = (str: string): string => str.replace(/-/g, "_");

const BASE_SIZE = 24; // base icon size 24x24

const svgFiles: string[] = readdirSync(srcDir).filter((f) =>
  f.endsWith(".svg"),
);
const componentNames: string[] = [];

for (const file of svgFiles) {
  const svgCode: string = readFileSync(join(srcDir, file), "utf8");
  const svgBuffer = Buffer.from(svgCode);
  const componentName: string = toPascalCase(basename(file, ".svg"));
  const snakeName: string = toSnakeCase(basename(file, ".svg"));

  // Web React
  const webCode: string = await transform(
    svgCode,
    {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      typescript: true,
      exportType: "named",
      namedExport: componentName,
      svgoConfig: { plugins: [{ name: "preset-default" }] },
    },
    { componentName },
  );
  writeFileSync(join(distReact, `${componentName}.tsx`), webCode);

  // React Native
  const rnCode: string = await transform(
    svgCode,
    {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      typescript: true,
      native: true,
      exportType: "named",
      namedExport: componentName,
      svgoConfig: { plugins: [{ name: "preset-default" }] },
    },
    { componentName },
  );
  writeFileSync(join(distRN, `${componentName}.tsx`), rnCode);

  // iOS — 1x, 2x, 3x
  const iosSizes = [
    { suffix: "", scale: 1 },
    { suffix: "@2x", scale: 2 },
    { suffix: "@3x", scale: 3 },
  ];
  for (const { suffix, scale } of iosSizes) {
    const size = BASE_SIZE * scale;
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(distIOS, `${snakeName}${suffix}.png`));
  }

  // Android — mdpi → xxxhdpi
  for (const { folder, scale } of androidDensities) {
    const size = Math.round(BASE_SIZE * scale);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(distAndroid, folder, `ic_${snakeName}.png`));
  }

  componentNames.push(componentName);
  console.log(`✔︎ ${componentName}`);
}

// Index files
const indexContent = componentNames
  .map((name) => `export { ${name} } from './${name}';`)
  .join("\n");

writeFileSync(join(distReact, "index.ts"), indexContent);
writeFileSync(join(distRN, "index.ts"), indexContent);

console.log(`✔︎ index.ts (web + rn)`);
console.log(
  `\nBuilt ${svgFiles.length} icons → dist/react/ + dist/rn/ + dist/ios/ + dist/android/`,
);

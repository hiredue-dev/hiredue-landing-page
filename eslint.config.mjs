import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });
const nextConfig = compat.extends("next/core-web-vitals");

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "public/**"] },
  ...nextConfig.map((config) => ({
    ...config,
    files: ["**/*.{js,jsx,mjs,cjs}"],
  })),
];

export default eslintConfig;

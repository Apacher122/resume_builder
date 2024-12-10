import { compile_resume } from "./utils/compile-latex.js";

const main = async () => {
  try {
    console.log("Attempting to compile resume");
    await compile_resume();
  } catch (error) {
    console.error(`Error during resume compilation: ${error.message}`);
    return;
  }
  console.log("Resume compilation successful.\nTo view information about changes, check /output/change-summary.md");
}

main();
import { compile_resume } from "./utils/compileLatex.js";

const main = async () => {
  try {
    console.log("Attempting to compile resume");
    await compile_resume();
    console.log("Resume compilation successful");
  } catch (error) {
    console.error(`Error during resume compilation: ${error.message}`);
  }
  console.log("End of process");
}

main();
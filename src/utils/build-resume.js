import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimizeExperience, optimizeProjects, optimizeSkills } from "./latex-editor.js"
import fs from 'fs';
import { logger } from './logger.js';
import { makeSinglePage } from '../helpers/resume-pdf-formatter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const validatePath = (filePath) => {
  // Implement path validation logic if necessary
  if (path.isAbsolute(filePath) && !filePath.includes('..')) {
    return filePath;
  }
  throw new Error('Invalid file path');
}

export const compile_resume = async () => {
  // Path to your .tex file
  const texFilePath = validatePath(path.join(__dirname, `..`, `latex`, `resume.tex`));
  const outputDir = validatePath(path.join(__dirname, `..`, `output`));

  // Purge old temporary files and logs
  cleanup(outputDir);

  try {
    await optimizeExperience();
    await optimizeSkills();
    await optimizeProjects();

  } catch (error) {
    console.error(`Error optimizing resume: ${error.message}\nSee logs for more information`);
    return;
  }

  // Execute the LaTeX command
  return new Promise((resolve, reject) => {
    logger.info(`Starting compilation`);

    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${outputDir}`,
      texFilePath
    ]);

    latex.stdout.on('data', (data) => {
      logger.info(data.toString());
    });

    latex.stderr.on('data', (data) => {
      logger.error(`LaTeX Error: ${data.toString()}`);
    });

    latex.on('close', async(code) => {
      if (code === 0) {
        await makeSinglePage();
        console.log("Resume compilation successful.\nTo view information about changes, check /output/change-summary.md");
        logger.info('Compilation successful');
        resolve();
      } else {
        reject(new Error(`LaTeX process exited with code ${code}`));
      }
    });
  });

};

const cleanup = (outputDir) => {
  // Clean up old change report
  const changeReport = path.join(__dirname, `..`, `output/change-summary.md`);
  if (fs.existsSync(changeReport)) {
    fs.truncateSync(changeReport, 0);
  }

  // Clean up temporary files 
  const extensions = ['.aux', '.log', '.out'];
  extensions.forEach(ext => {
    const tempFile = path.join(outputDir, `resume${ext}`);
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });
  logger.info('Temporary LaTeX files purged');
};
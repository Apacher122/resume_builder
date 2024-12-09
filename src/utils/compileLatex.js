import { exec, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimizeExperience } from "./latexEditor.js"
import fs from 'fs';
import { logger } from './logger.js';

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
  const logDir = validatePath(path.join(__dirname, `..`, `logs`));
  
  // Purge logs and temporary files
  cleanup(outputDir, logDir);
  
  try {
    await optimizeExperience();
    // await optimizeSkills();
  } catch (error) {
    console.error(`Error optimizing resume: ${error.message}`);
    return;
  }

  // Execute the LaTeX command
  return new Promise((resolve, reject) => {
    console.log(`Starting compilation`)

    const latex = spawn('xelatex', [
      `--interaction=nonstopmode`,
      `-output-directory=${outputDir}`,
      texFilePath
    ]);

    latex.stdout.on('data', (data) => {
      logger.verbose(data.toString());
    });

    latex.stderr.on('data', (data) => {
      logger.error(data.toString());
    });

    latex.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
};

const cleanup = (outputDir, logDir) => {
  // Remove old logs
  const oldLogs = fs.readdirSync(logDir);
  oldLogs.forEach(log => {
    const logPath = path.join(logDir, log);
    if (fs.statSync(logPath).isFile()) {
      fs.unlinkSync(logPath);
    }
  });

  // Clean up temporary files
  const extensions = ['.aux', '.log', '.out'];
  extensions.forEach(ext => {
    const tempFile = path.join(outputDir, `resume${ext}`);
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });
};
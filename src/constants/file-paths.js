import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const latexFilesPath = path.join(__dirname, `..`, `latex`, `resume`);

export const FILE_PATHS = {
    RESUME_JSON: path.resolve(__dirname, `../../data/resume.json`),
    JOB_POSTING: path.resolve(__dirname, `../../data/jobPosting.txt`),
    LOG_FILE: path.resolve(path.dirname(fileURLToPath(import.meta.url), `../logs/info.log`)),
    ERROR_LOG_FILE: path.resolve(path.dirname(fileURLToPath(import.meta.url), `../logs/error.log`)),
    CHANGE_REPORT: path.resolve(path.dirname(fileURLToPath(import.meta.url), `../output/change-summary.md`))
}

export const LATEX_FILES = {
    EXPERIENCE: `${latexFilesPath}/experience.tex`,
    SKILLS: `${latexFilesPath}/skills.tex`,
}
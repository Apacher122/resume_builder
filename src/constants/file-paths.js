import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const latexFilesPath = path.join(__dirname, `..`, `latex`, `resume`);

export const FILE_PATHS = {
    RESUME_DATA: path.resolve(__dirname, `../../data/resume.json`),
    JOB_POSTING: path.resolve(__dirname, `../../data/jobPosting.txt`),
    LOG_FILE: path.resolve(__dirname, `../logs/info.log`),
    ERROR_LOG_FILE: path.resolve(__dirname, `../logs/error.log`),
    CHANGE_REPORT: path.resolve(__dirname, `../../output/change-summary.md`),
    COMPILED_RESUME: (title = '') => path.resolve(__dirname, `../../output/${title}_resume.pdf`),
}

export const LATEX_FILES = {
    EXPERIENCE: `${latexFilesPath}/experience.tex`,
    SKILLS: `${latexFilesPath}/skills.tex`,
    PROJECTS: `${latexFilesPath}/projects.tex`,
}
import { promises as fsPromises } from 'fs';
import { FILE_PATHS } from '../constants/file-paths.js';
export const parseJSONData = async (filePath) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData)
    } catch (error) {
        console.error(`Could not parse JSON data ${error.message}`);
        throw error;
    }
}

export const getCurrentResumeContent = async (isJson = false) => {
    if (isJson ) {
        return parseJSONData(FILE_PATHS.RESUME_DATA);
    }

    try {
        const resumeContent = await fsPromises.readFile(FILE_PATHS.RESUME_DATA, 'utf-8');
        return resumeContent;
    } catch (error) {
        console.error(`Error reading resume data: ${error.message}`);
        throw error;
    }
}

export const getJobPostingContent = async (isJson = false) => {
    if (isJson == true) {
        return parseJSONData(FILE_PATHS.JOB_POSTING);
    }

    try {
        const jobPostingContent = await fsPromises.readFile(FILE_PATHS.JOB_POSTING, 'utf-8');
        return jobPostingContent;
    } catch (error) {
        console.error(`Error reading job posting: ${error.message}`);
        throw error;
    }
}

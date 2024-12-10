import { readFile } from 'fs/promises';
import { messageOpenAI } from '../services/openai-services.js';
import { experienceResponse, skillsResponse, projectsResponse } from '../models/resume-items.js';
import { promises as fsPromises } from 'fs';
import { logger} from './logger.js';
import { PROMPTS } from '../constants/prompts.js';
import { FILE_PATHS, LATEX_FILES } from '../constants/file-paths.js';
import { ResumeSectionNotFoundError } from '../errors/resume-builder-errors.js';
import { generateChangeReport } from './change-report.js';
import { titleFormat } from '../helpers/text-formatter.js';

const resumeJson = await readFile(FILE_PATHS.RESUME_JSON, 'utf-8');
const jobPostingContent = await readFile(FILE_PATHS.JOB_POSTING, 'utf-8');
const parsedResumeData = JSON.parse(resumeJson);

export const optimizeExperience = async() => {
  const prompt = PROMPTS.EXPERIENCE(JSON.stringify(parsedResumeData), jobPostingContent);
  const response = await messageOpenAI(prompt, experienceResponse);
  const newContent = response.experiences.map(generateExperienceSection);

  let latexContent;
  try {
    latexContent = await fsPromises.readFile(LATEX_FILES.EXPERIENCE, 'utf8');
  } catch (error) {
    logger.error(`Error reading from experience.tex: ${error.message}`);
    throw error;
  }

  generateChangeReport(response);

  try {
    const newEntries = replaceCventries(latexContent, newContent)
    await fsPromises.writeFile(LATEX_FILES.EXPERIENCE, newEntries, 'utf-8');
  } catch (error) {
    if (error instanceof ResumeSectionNotFoundError) {
      logger.error(`Error replacing cventries: ${error.message}\n\tCheck LaTeX syntax in experience.tex`);
    } else {
      logger.error(`Error writing to experience.tex: ${error.message}`);
    }
    throw error;
  }
}

export const optimizeSkills = async() => {
  const prompt = PROMPTS.SKILLS(JSON.stringify(parsedResumeData), jobPostingContent);
  const response = await messageOpenAI(prompt, skillsResponse);
  const newContent = response.skills.map(generateSkillsSection);

  let latexContent;
  try {
    latexContent = await fsPromises.readFile(LATEX_FILES.SKILLS, 'utf8');
  } catch (error) {
    logger.error(`Error reading from skills.tex: ${error.message}`);
    throw error;
  }

  generateChangeReport(response);

  try {
    const newSkills = replaceCvSkills(latexContent, newContent);
    latexContent = await fsPromises.writeFile(LATEX_FILES.SKILLS, newSkills, 'utf-8');
  } catch (error) {
    if (error instanceof ResumeSectionNotFoundError) {
      logger.error(`Error replacing cvskills: ${error.message}\n\tCheck LaTeX syntax in skills.tex`);
    } else {
      logger.error(`Error writing to skills.tex: ${error.message}`);
    }
    throw error;
  }
}

export const optimizeProjects = async() => {
  const prompt = PROMPTS.PROJECTS(JSON.stringify(parsedResumeData), jobPostingContent);
  const response = await messageOpenAI(prompt, projectsResponse);
  const newContent = response.projects.map(generateProjectsSection);

  let latexContent;
  try {
    latexContent = await fsPromises.readFile(LATEX_FILES.PROJECTS, 'utf8');
  } catch (error) {
    logger.error(`Error reading from projects.tex: ${error.message}`);
    throw error;
  }

  generateChangeReport(response);

  try {
    const newEntries = replaceCventries(latexContent, newContent);
    await fsPromises.writeFile(LATEX_FILES.PROJECTS, newEntries, 'utf-8');
  } catch (error) {
    if (error instanceof ResumeSectionNotFoundError) {
      logger.error(`Error replacing cventries: ${error.message}\n\tCheck LaTeX syntax in projects.tex`);
    } else {
      logger.error(`Error writing to projects.tex: ${error.message}`);
    }
    throw error;
  }
};

const generateExperienceSection = ({ position, company, start, end, description }) => {
  const cvItems = description
  .map(
    ({ text }) =>
      `    \\item {${text.replace(/%/g, "\\%").replace(/#/g, "\\#")}}` // Escape '%' for LaTeX
  )
  .join("\n");

  return `
  \\cventry
    {${company}} % Organization
    {${position}} % Job title
    {} % Location
    {${start} - ${end}} % Date(s)
    {
      \\begin{cvitems} % Description(s) of tasks/responsibilities
  ${cvItems}
      \\end{cvitems}
    }`;
};

const generateSkillsSection = ({category, skill}) => {
  const skillList = skill
  .map(({ item }) => 
    item.replace(/[%#&]/g, match => ({
      '%': '\\%',
      '#': '\\#',
      '&': '\\&'
    }[match]))
  ) // Escape special characters for LaTeX
  .join(', ');

  return `
    \\cvskill
      {${titleFormat(category)}} % Category
      {${skillList}} % Skills
  `;
};

const generateProjectsSection = ({ name, role, status, description }) => {
  const cvItems = description
  .map(
    ({ text }) =>
      `    \\item {${text.replace(/%/g, "\\%").replace(/#/g, "\\#")}}` // Escape '%' for LaTeX
  )
  .join("\n");

  return `
  \\cventry
    {${role}} % Role
    {${name}} % Event
    {} % Location
    {${status}} % Date(s)
    {
      \\begin{cvitems} % Description(s)
  ${cvItems}
      \\end{cvitems}
    }`;

};

const replaceCvSkills = (texContent, cvskills) => { 
  const cvskillsStart = "\\begin{cvskills}";
  const cvskillsEnd = "\\end{cvskills}";

  // Locate the cvskills environment
  const startIndex = texContent.indexOf(cvskillsStart);
  const endIndex = texContent.indexOf(cvskillsEnd);

  if (startIndex === -1 || endIndex === -1) {
    throw new ResumeSectionNotFoundError("No cvskills environment found in the file.");
  }

  // Build the new cvskills content
  const newCvskills = `${cvskillsStart}\n${cvskills.join(
    "\n"
  )}\n${cvskillsEnd}`;

  return (
    texContent.slice(0, startIndex) +
    newCvskills +
    texContent.slice(endIndex + cvskillsEnd.length)
  );
};

const replaceCventries = (texContent, cventries) => {
  const cventriesStart = "\\begin{cventries}";
  const cventriesEnd = "\\end{cventries}";

  // Locate the cventries environment
  const startIndex = texContent.indexOf(cventriesStart);
  const endIndex = texContent.indexOf(cventriesEnd);

  if (startIndex === -1 || endIndex === -1) {
    throw new ResumeSectionNotFoundError("No cventries environment found in the file.");
  }

  // Build the new cventries content
  const newCventries = `${cventriesStart}\n${cventries.join(
    "\n"
  )}\n${cventriesEnd}`;

  // Replace the existing cventries environment
  return (
    texContent.slice(0, startIndex) +
    newCventries +
    texContent.slice(endIndex + cventriesEnd.length)
  );
};

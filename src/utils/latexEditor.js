import { readFile } from 'fs/promises';
import path, { parse } from 'path';
import { messageOpenAI } from '../services/openaiServices.js';
import { experienceResponse, skillsResponse } from '../models/resumeItems.js';
import { fileURLToPath } from 'url';
import fs, { promises as fsPromises } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, `..`, `latex`, `resume`);

export const optimizeExperience = async() => {
  const resumeJsonfilePath = path.resolve(__dirname, `../../data/resume.json`)
  const jobJsonFilePath = path.resolve(__dirname, `../../data/job.json`)
  const resumeJson = await readFile(resumeJsonfilePath, 'utf-8');
  const jobJson = await readFile(jobJsonFilePath, 'utf-8');
  const parsedResumeData = JSON.parse(resumeJson);
  const parsedJobData = JSON.parse(jobJson);
  let latexContent;
  try {
    latexContent = await fsPromises.readFile(`${filePath}/experience.tex`, 'utf8');
  } catch (error) {
    console.error(`Error reading experience.tex: ${error.message}`);
    return;
  }

  const prompt = `
    Make adjustments for each position I held in my JSON-formatted resume to better match a job description.
    Optimize it for ATS.

    Rules:
    You are allowed to remove or rephrase any "responsibilities" or "description" item for each position held if it is
    redundant, wordy, annoying, clichè, and/or irrelevant.
    You are not allowed to remove experiences, only descriptions/responsibilities.
    You may infer/suggest new "responsibilities" or "description" bullet points based off current experience.
    Provide justification for changes.
    There must be at least 4 "responsibilities" or "description" items for each position.
    Do not exceed the optimal amount of "responsibilities" or "description" items for each position..
    DO NOT LIE.

    My resume as a JSON: ${JSON.stringify(parsedResumeData)}\n\n
    Description of job I am applying for: ${JSON.stringify(parsedJobData)}
  `;

  const response = await messageOpenAI(prompt, experienceResponse);
  const experiences = response.experiences;

  const temp = response.experiences.map(generateExperienceSection);
  const newEntries = replaceCventries(latexContent, temp)
  try {
    await fsPromises.writeFile(`${filePath}/experience.tex`, newEntries, 'utf-8');
  } catch (error) {
    console.error(`Error writing experience.tex: ${error.message}`);
  }
  // experiences.forEach((experience, index) => {
  //   console.log(`Experience ${index + 1}:`, experience);
  // });
}

export const optimizeSkills = async() => {
  const resumeJsonfilePath = path.resolve(__dirname, `../../data/resume.json`)
  const resumeJson = await readFile(resumeJsonfilePath, 'utf-8');
  const parsedResumeData = JSON.parse(resumeJson);
  let latexContent;
  try {
    latexContent = await fsPromises.readFile(`${filePath}/skills.tex`, 'utf8');
  } catch (error) {
    console.error(`Error reading skills.tex: ${error.message}`);
    return;
  }

  const prompt = `
    Optimize the skills section of my JSON-formatted resume for ATS.

    Rules:
    You are allowed to remove or rephrase any skill if it is redundant, wordy, annoying, clichè, and/or irrelevant.
    You are not allowed to remove skill categories, only individual skills.
    You may infer/suggest new skills based on current experience.
    Provide justification for changes.
    Do not exceed the optimal amount of skills for each category.
    DO NOT LIE.

    My resume as a JSON: ${JSON.stringify(parsedResumeData)}
  `;

  const response = await messageOpenAI(prompt, skillsResponse);
  const skills = response.skills;

  const newSkillsContent = generateSkillsSection(skills);
  try {
    await fsPromises.writeFile(`${filePath}/skills.tex`, newSkillsContent, 'utf-8');
  } catch (error) {
    console.error(`Error writing skills.tex: ${error.message}`);
  }
}

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

const generateSkillsSection = (skills) => {
  return skills.map(({ category, items }) => `
  \\cvskill
    {${category}} % Category
    {${items.join(', ')}} % Skills
  `).join('\n');
};

const replaceCventries = (texContent, cventries) => {
  const cventriesStart = "\\begin{cventries}";
  const cventriesEnd = "\\end{cventries}";

  // Locate the cventries environment
  const startIndex = texContent.indexOf(cventriesStart);
  const endIndex = texContent.indexOf(cventriesEnd);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("No cventries environment found in the file.");
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

const getLatexContent = async(regex, file) => {
  try {
    let latexContent = await fsPromises.readFile(`${filePath}/${file}.tex`, 'utf8');
    const match = latexContent.match(regex);
    return match ? match[1].trim() : null;
  } catch (error) {
    console.error(`Error reading ${file}.tex: ${error.message}`);
    return null;
  }
}

const updateLatexContent = async(regex, file) => {
  try {
    let latexContent = await fsPromises.readFile(`${filePath}/${file}.tex`, 'utf8'); 
  } catch (error) {
    console.error(`Error reading ${file}.tex: ${error.message}`);
  }
}

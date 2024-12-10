export const PROMPTS = { 
    EXPERIENCE: (resumeData, jobPostingContent) =>`
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
  
    My resume as a JSON: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}`,

    SKILLS: (resumeData, jobPostingContent) =>`
    Make adjustments for each position I held in my JSON-formatted resume to better match a job description.
    Optimize it for ATS.

    Rules:
    From the technical skills section of my resume, pick skills relevant to the job description.
    You may leave certain technologies in if they are translatable to the job.
    No soft skills in this section.
    Do not add technologies that are not in my resume.
    Provide justification for changes made to each skill category.
    DO NOT LIE.
  
    My resume as a JSON: ${resumeData}\n\n
    Description of job I am applying for: ${jobPostingContent}`,

}
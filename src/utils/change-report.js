import { appendFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const changeReportPath = path.join(__dirname, `..`, `output/change-summary.md`);

export const generateChangeReport = (response) => {
    let content = '';
    if (response.experiences) {
        content += '# Changes made to Experience Section\n\n';
        response.experiences.forEach((exp) => {
            content += `## Position: ${exp.position}\n\n`;
            content += `### Company: ${exp.company}\n\n`;
            exp.description.forEach((desc) => {
                content += `* ${desc.text}\n`;
                content += `***Justification: ${desc.justification_for_change}***\n\n`;
            });
        });
    } else if (response.skills) {
        if (response.skills) {
            content += '# Changes made to Skills Section\n\n';
            response.skills.forEach((skill) => {
                const skillItems = skill.skill.map((item) => item.item).join(', ');
                content += `* ${skill.category}: ${skillItems}\n`;
                content += `***Justification: ${skill.justification_for_changes}***\n\n`;
            });
        }
    } else if (response.projects) {
        content += '# Changes made to Projects Section\n\n';
        response.projects.forEach((project) => {
            content += `## Project: ${project.name}\n\n`;
            content += `### Role: ${project.role}\n\n`;
            content += `### Status: ${project.status}\n\n`;
            project.description.forEach((desc) => {
                content += `* ${desc.text}\n`;
                content += `***Justification: ${desc.justification_for_change}***\n\n`;
            });
        });
    }

    appendFileSync(changeReportPath, content);
}
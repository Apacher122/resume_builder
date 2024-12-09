# Looking for a job? Me too buddy...

As recommended by anyone in any corporate environment, tailoring your resume to a company is probably a good idea.
I'm working on this tool for my own job search to help me optimize my resume for each position I'm applying for.

- Things this doohickey does:
    1. Takes information you provide about your career history (in the form of an old resume, or, if you wish, a novel).
    2. Brings forward any skills and experience relevant to the position, while removing/ignoring irrelevant items.

- Things this doohickey doesn't:
    1. Lie for you. I designed this tool to specifically use information you provided. If you mentioned nothing about fight club, it shouldn't say anything about fight club. This is simply a tool to help streamline having to constantly edit your resume. Use good judgement, measure twice, cut once, do your taxes, fold your laundry, and do better.

This thing requires an OpenAI API key, which does cost some money. Money that only a job can give you :/

## **Instructions:**
*Requirements: OpenAI API key, Docker, Node.JS*

1. Create "config" directory in project root.
2. Add a .env file in the newly created "config" directory.
    - In this .env file, add the following:
        ```OPENAI_API_KEY = # Your Openai API key.```
3. In ./data/ there are a couple files for you to edit:
    - job.json: Job description in json format (optional)
    - jobPosting.txt: Job details (Company name, about, etc).
    - resume.json: Your resume in a json format (gonna change this up to make it easier).
4. In your editor's terminal (or whatever terminal you're using) run the following:
    ```
    docker compose build
    docker compose up
    ```

# Looking for a job? Me too buddy

As recommended by anyone in any corporate environment, tailoring your resume to a company is probably a good idea.
I'm working on this tool for my own job search to help me optimize my resume for each position I'm applying for.

- Things this doohickey does:
    1. Takes information you provide about your career history (in the form of an old resume, or, if you wish, a novel).
    2. Brings forward any skills and experience relevant to the position, while removing/ignoring irrelevant items.

- Things this doohickey doesn't:
    1. Lie for you. I designed this tool to specifically use information you provided. If you mentioned nothing about fight club, it shouldn't say anything about fight club. This is simply a tool to help streamline having to constantly edit your resume. Use good judgement, measure twice, cut once, do your taxes, fold your laundry, and do better.

This thing requires an OpenAI API key, which does cost some money. Money that only a job can give you :/  
There's probably other LLM's I can use that are free. I'll find them someday or make my own - which ever comes first.

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

Any changes made to your resume will be explained under /logs/info.log

## Additional Info

Credit for the resume template goes to Claud D. Park <posquit0.bj@gmail.com>  
You can view the template here: <https://github.com/posquit0/Awesome-CV>

## TODO

1. Add functionality to showcase relevant skills on resume.
2. Add functionality to showcase relevant projects on resume.
3. Add functionality to showcase relevant courses taken on resume.
4. Don't cry.

# Folder for all the 2023-2024 projects (UG and PGT) 
- Visual Analytics for Sensemaking:
  - Ziyue Wang (UG): support comparison of online shopping options with knowledge graph
  - Jiaqi Li (PGT): (team collaborative platform, multitask management and summarization)
- Human-AI teaming
  - Rachana Hegde (PGT): image generative AI for writers
  - Jianwen Lyu (UG): General Support for Machine Learning Process (JupyterLab Extension).
  - Peining: help artists record the images generated, personalised recommendations, website, 
- Chat with your data using LLM
  - Hongye An (PGT): Chat with your academic papers with LLM
- LLM for trading ([meeting notes](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/llm-trading.md))
  - Raul Farkas (UG)
  - Muhamad Hermawan (PGT)
  - Xiruo Sun (PGT)

 |                   | Ziyue | Jiaqi | Rachana | Jianwen | Peining | Hongye |
 |-------------------|-------|-------|---------|--------|---------|--------|
 |interview questions|       | [Questions](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/interview_question.md) | [Questions](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/interviews/user-interview-questions.md)     |  [Questions](./jianwen-lyu/interviews/Questions.md)      |         |    [questions](./hongye-an/interview/interview-question.md)    |
 |recruit user       |  1    |4 users| 3 users |  2 users    |         |    1    |
 |conduct interview  |  1    |[user1](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/response_1.md),[user2](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/response_2.md),[user3](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/response_3.md), [user4](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/response_4.md)  | [User 1](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/interviews/interview-user-one.md), [User 2](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/interviews/interview-user-two.md), [User 3](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/interviews/interview-user-three.md)     |        |         |    [interview-01](./hongye-an/interview/interview-01.md) [interview-02](./hongye-an/interview/interview-02.md)   |
 |analyse data       |       |[Analysis](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/analysis.md)       | [Analysis](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/interviews/user-interview-analysis.md) |        |         |        |
 |requirement list   |       |[Requirement](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/jiaqi-li/interview/requirement.md)      | [requirements](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/rachana-hegde/updated_requirements.md)  |      |         |        |
 |prototype          | A simple extension |        |         |        |         |    [prototype](./hongye-an/proj-code/README.md)    |

# 12 Jan 2023

Ziyue
1. progress ...
   - New interviews following previous question list.
   - Develop extension.
2. question and difficulty ...
   - There are many browsers, just develop it for google? Or develop it for Miscrosoft edge?
3. next step ...
   - analyse the results of interview - requirement list
   - create a design of the extension
   - test google knowledge graph api: [postman](https://www.postman.com/)
   - Set a usable user interface if the extension set up process is done.

Jiaqi
1. progress
   1. Finishied user interview and analysis. Pull out the requirements and functionality list.
   1. Tested the prompt's ability to produce a dense summary from the article. 
2. question and difficulty
   1. what kind of database to store the data. (vector database, knowledge graph or json file)
3. next step
   - User interface design and implementation

Rachana
1. progress: annotating research papers on using LLMs for creative writing tasks - i.e. plot generation and script generation. Experimented with finetuning stable diffusion with dreambooth via google colab.
2. question and difficulty: determining the kind of research contribution my project can make and how it will help with writer's block
3. next step: reading papers on writer's block & solutions and generative AI for writing or story illustration, deciding on research direction, coming up with high level plan.

Jianwen
1. progress ...
   - finished 2 user interviews, established concrete project plan.
   - finished initial project code structure
3. question and difficulty ...
   - how to extract model components from text code?
   - how to control the trggering of preview updates?
5. next step ...
   - combine extension's user interatcion with code comments generation
   - figure out user's preference of visualizations and previewing contents 

Hongye
1. progress:
   
   a. Work with the interim report (progress: 50%), expect to finish the first edition and request review by next Wednesday.

   b. Continue to improve the prototype, use `langchain` in backend side and `three.js` in frontend to visualization.

2. question and difficulty:
   
   a. What is the subsequent mid-term presentation process?
  
3. next step:
   
   a. Continue to improve the prototype.
   
   b. Based on the midterm report, combined with the evaluation section, proceed to complete the final report.

Peining
1. progress ...
2. question and difficulty ...
3. next step ...
  
# 8 Dec 2023

This is the last meeting for this year, and we will resume on 12 Jan 2024.

## Todo
Ziyue
- revise the interview questions
- conduct the interview
- transcribe the recordings
- compile a list of requirements

Jiaqi
- revise the interview questions
  - make a distinction between understanding one's own and someone else's process
- continue the interview/questionnaire: try to do some face-to-face sessions (in person or online)
- start compiling the requriement list
- search for papers about information needed to reconstruct the sensemaking process
- Have a look of the 'mv3' branch of the historymap code: https://github.com/Vis4Sense/HistoryMap/tree/mv3

Rachana
- try out the apple ML library for Stable Diffusion
- add a bit more context and supported writing tasks to the requirements
- Reduce the requirement list to 4~5 points if you can
- for the UI design, identify the components that will be the research contributions in the paper and focus on those first

Jianwen
- Read the verdant papers on the project page: https://kaixu.me/2023/09/16/machine-learning-provenance-for-hyperparameter-tuning/
- Recruite potential users, interview, and create the requirement list
- Start the UI design

Hongye
- Interview with another candidate
- Use [SentEval](https://github.com/facebookresearch/SentEval) to do some brenchmark
- Read the paper on https://ieeexplore.ieee.org/document/9939115

# 1 Dec 2023

## Todo
Ziyue
- create a list of interview questions about the user needs
- recruit a few more users
- identify a specific use case, for example for a website (such as Tesco or Amazon) or a product (such as camera)

Jiaqi
- design a sensemaking scenario for the interview
- create a list of interview questions about the user needs
- recruit a few more users

Rachana
- add informatoin to the table
- create an updated list of requirements (more focused version)
- separate research requirements from implementation requirements
- have a look of there is any other API and or generative image models that are suitable

Jianwen
- Read the automl visualisation paper on the project webpage

# 24 Nov 2023 
- Ziyue: help user build a knowledge (sub)graph related to his/her research
- Rachana is leaving on 14 Dec and coming back 12 Jan
  - interviewed two users
  - transcribe the interview
  - come up a list of requirements
  - started website structure design (sitemap)
- Jiawen: change the project topic
- Hongye:
  - will further develop vatility
    - change the backend to document vector similarity search
    - update the frontend accordingly
  - will be away next Friday

## Todo
- All:
  - please update the table above based on your progress so far: a brief summary of the outcomes so far and link to the document/code in the repository folder.
  - continue the tasks in the table that are not completed yet
  - add all the tasks that you plan to work on before the next meeting to this list (if they are not here yet)
- Ziyue: 
  - pick a specific use case if buying camera is not relevant to the user
  - learn more about how to let user update knowledge graph and how to use knowledge graph
- Rachana
  - pick a few requirements to focus on for the project
  - think about possible solutions to meet these requirements
  - start the sketch out solution ideas
- Hongye: compare the performance of different LLMs for similarity search:
  - see if there is any existing paper/work on such comparison
  - if not, find a benchmark dataset for comparison
  - vector storage built-in LLM
  - LLM APIs,
  - open-source LLM with different sizes, such as 7B, 13B, and 70B version of Llama2
  - different levels of quantisation: 16bit, 8bit, 4bit, 2bit, etc.


# 17 Nov  2023

Rachana: design the interview and ethics

Ziyue Wang: 
- talked to the PhD student
- graphical neural networks

Peining
- MSc HCI
- Image models for artists
- ask sister in US to recruit artists

Jianwen
- interview with ameture user interested in stable diffusion
- building a notebook extension

Hongye
- talk to neighbour, who is a master student, need more preparation to under his paper reserach needs
- building a prototype with kaggle arxiv dataset with chroma

Jiaqi
 - talked to 4 users
 - phd student: extract the 'method' section from a set of papers
 - colleague:
   - have one window (multiple tabs) for each task
   - infer the connection between webpages
 - different ways of grouping tabs
 - a simple browser extension with popup

## To do
- continue with the user requirements if not finished
- continue with the prototype if not finished
- **further narrow down the project idea**
- push/upload your code/documents (markdown) to the repository folder
- Have a look of the quantisd LLMs lised in the Teams chat, compare the performance of different models
- have a look of the azure openAI api document
- write down the interview with enough information that someone new can understand
  - and come up with some requirements from the interview
- Ziyue: research on knowledge graph, not graph neural network
- Ziyue: find users with problem you can help with
- Peining: identify potential users and their challenges
- Jiawen: decide
  - whether to include recommendation or not (i.e., just history visualisation)
  - wheter to support web or notebook interface
  - try to capture the values from the disco diffusion notebook as a start
  

# 10 Nov 2023

- Rachana:
  - user study  
  - gpt-3.5-turbo-1106 + dalle2
  - storyboarding
  - £40
  - 5 users
- Hongye
  - vector db can create text embedding: chroma
  - locally run LLM - Illma 2 - 7B
- Users
  - Rachana: 1 CS student writing a book, a poet in canada
  - Jianwen: one student from group project, personal interest, midjourney; an anime interest group
  - Hongye: PhD student reseraching in recommender security, literature review
  - Ziyure: Jianwen, PhD student at Warwick, searching and comparison, roommate CS,
  - Jiaqi: intern colleague, developer, always has lots of tab, PhD in Japan, agriculture, create a mindmap

## Todo
- Talk to your users to understand their requirements and challengs.
- Start designing and buidling a very simple end-to-end prototype


# 3 Nov 2023
- [Generative AI for Everyone](https://www.deeplearning.ai/courses/generative-ai-for-everyone/)
- Rachana - papers: [Where to Hide a Stolen Elephant: Leaps in Creative Writing with Multimodal Machine Intelligence](https://dl.acm.org/doi/10.1145/3511599) and [Grimm in Wonderland: Prompt Engineering with Midjourney to Illustrate Fairytales](https://arxiv.org/abs/2302.08961)
- Jiaqi [Design Order Guided Visual Note Layout Optimization](https://ieeexplore.ieee.org/document/9767765) and [Target Netgrams: An Annulus-Constrained Stress Model for Radial Graph Visualization](https://ieeexplore.ieee.org/document/9814874/)
- Jianwen [Beyond Text-to-Image: Multimodal Prompts to Explore Generative AI](https://dl.acm.org/doi/10.1145/3544549.3577043) and [Enhancing Arabic Content Generation with Prompt Augmentation Using Integrated GPT and Text-to-Image Models](https://dl.acm.org/doi/10.1145/3573381.3596466)
- Hongye [VITALITY: Promoting Serendipitous Discovery of Academic Literature with Transformers & Visual Analytics
](https://ieeexplore.ieee.org/document/9552447) and [Interactive and Visual Prompt Engineering for Ad-hoc Task Adaptation with Large Language Models
](https://ieeexplore.ieee.org/abstract/document/9908590?casa_token=FpG4__iGu-8AAAAA:vQgLsYE0rVFPI6QfdJ00vSJaBKY8WUb1PoaCPZvFwBxgixdpdP5DrVqowU3wGZv7lQNpyT-OoA)
- Ziyue [DIVI: Dynamically Interactive Visualization
  ](https://ieeexplore.ieee.org/document/10299539) and [Foresight, sensemaking, and new product development: Constructing meanings for the future
  ](https://www.sciencedirect.com/science/article/pii/S0040162522004668)
  
## Todo
- add the paper(s) you found to the meeting notes above 
- decide on the LLM API you want to use
  - The cost of the API and roughly the total cost
- find some potential users, just 2-3 for now


# 27 October 2023

## Todo
- Kai to add the [prompthis paper](https://github.com/Vis4Sense/student-projects/blob/main/instructions/202310022007-prompthis.pdf) to the repository (please do not distrubte the paper as it is not published yet)
- Kai to add the Richard interview: the summary and images discussed are in this [google folder](https://drive.google.com/drive/folders/1A9SnyVm7mEd-FsuFxO8po6s2_f0U4aVq?usp=sharing), but the actual recording is no longer available (auto deleted by zoom).
- Kai to add information about vitality tool (added to the [project page](https://kaixu.me/2023/09/14/llm-for-literature-review/))
- Find at least one paper from either TVCG or CHI that is relevant to your project
  - By going through the papers published in 2023 
  - And add it to your zotero database
- Finalise your project idea

# 20 October 2023

## To do list
- Start writing or revise your project proposal
- ethics forms/approval: prelimimary/full ethics form and data management plan
- (optional) find **one** relevant paper (not listed on the webpage).

# 13 October 2023

## Task for next week
- post your github account name in the teams chat, so Kai can add you to the project repository
  - Once added to the repository, created a folder under the `2023-2024` directory with your name and add a file named `readme.md` there with a brief description of what your project is.
- agree the time for weekly meeting
- read one paper (Kai will ask you to discuss the paper next week)
- UG proposal draft by next Wed

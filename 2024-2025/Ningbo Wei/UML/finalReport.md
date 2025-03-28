# Final report outline

## Introduction
### Motivation
- current situation in user web browser using
- Hard for users to make judement in a serise of messy tabs
- The important of visualisation in sense-making.
- The use of LLM in sense-making
### Related works and background
- sensemap, -- lack of functions in automatically tabs clustering and explanations
- CoSense, -- use shared workspace to support real-time team work
- Large language model
    - gpt and its usage in tools for sense-make
- pervious students work
    - jiaqiLi, --lack of user interaction in tab commenting/high lighting, advance searching functions and group working functions.
### Aims and Objectives
build a Google Chrome extension with LLM that processes user browsing information to improve efficiency in multitasking situations. Comparing to previous approaches, this mainly focuses on improving user’s interaction with the tools, better application of LLM for tab analysis and grouping, achieving result sharing for team collaboration. 
- Visualise user's massive and chaotic browsing information. (in a chrome extention)
- Apply LLM for information analyze, grouping and filtering.
- Achieve a chatbot for advance searching.
- Built an user interface supporting strong user interaction. 
- Establish information sharing and importing function for group working.
## Description of the work
### User analysis
- what user really want for a visualisation tool?
### requiements 
- use case diagram

## Design and Methodology
### Interface design
- prototype
### System design
- Architecture of the system
### Back-end Methodology
- use chrome extentsion as backend for page content extraction
- use chrome local storage
    - reason why not use scync storage and strcuterd data basd like python+sqlite
- apply gpt-4o-mini in hrome extentsion for page and task summary
    - reason why given up adding image-to-text summary
- node grouping: LLM based grouping, word embedding+cosine simmilarty, tf-idf

## Implementation
### web page recognition
- code and prompt
### making summaries of pages and tasks
- code and prompt
- how to handle 429 problem
### node grouping
- code+prompt
- problem of law accuracy in user customize grouping (word embedding + cosine simmilaryty)
### Advance searching
- answer question in tab/task
- inspriation of "RAG"
### main interface
- fomat/structure of data in the storage

## prototype walk-through (is this the user handbook?)

## Evaluation
### Preliminary Preparation
- Participant selection
- Task design 
- Evalutaion, user question, interview
- quantitative features, usability analysis
- discuss


## Discussion

## Conclution


# Visual Analytic for Sensemaking
https://kaixu.me/2024/08/28/analytic-provenance-for-sensemaking/


## Project Tasks

### 0. understand basic requirement of the project
| Subtask Name          | Expected Completion Date | Current Status | Completion Date | Notes       |
|-----------------------|---------------------------|----------------|-----------------|-------------|
| understand basic requirement of the project | 7/Oct/2024 | Finished    | 7/Oct/2024    |             |
| literature search and review      | 14/Oct/2024      | Finished  | 14/Oct/2024      |             |
| Usecase Diagrams      | 14/Nov/2024       | Finished    | 14/Nov/2024                 | Have added some modify after user research    |
| Activity Diagrams     | 14/Nov/2024      | Finished  | 14/Nov/2024           |             |
| Hand Draw Prototype   | 28/Nov/2024        | Finished    | 20/Nov/2024          |             |

### 1. build a demo google chrom extention, with simple frontend
- **why google chrom extention**: For better extract the data from users, including their Browsing History
- **sub tasks**: build an backend and frontend, ensure that user can have interaction with it.
- access the content of each tabs on the browser
- extract both text and images, but need to clean those advertesment/cookies setting info if necessary
- show the info of this tab(title, low-image) on the user interface

| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Learn how to build Chrome extension | 14/Oct/2024         | Finished   | 14/Oct/2024        |             |
| Extract title of the tabs       | 21/Oct/2024         | Finished    |  21/Oct/2024     |             |
| Extract text info of tabs       | 21/Dec/2024          | currently processing  |   TBD |  meet some problem in garbage text, like cookie setting     |
| Extract images info from tabs   | 28/Dec/2024         | Not Started    | TBD             |             |

### 2 built a backendand and a frontend
- user need to open this throug http8080....
- **why built a new backend and frontend instead of using chrom extention?**
    - more flexibility and extentionable, easy to achieve complex functions and implementing testing. 
    - Can implement and manten them individually.
    - It is easier and more flexble to use api form python comparing to javascripts
    - But still require to built a google extention to gain the user's info
| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Accept data from Google Chrome extension | 7/Nov/2024      | Finished   | 7/Nov/2024        |             |
| Database Development            | 31/Dec/2024      | Not Started    | TBD             |             |
| Integration with Frontend       | 21/Jan/2025        | Not Started    | TBD             |             |
| Apply NLP Interface             | 1/Mar/2025           | Not Started    | TBD             |             |

| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Learn how to use React          | 30/Nov/2024        | currently processing  | TBD             |             |
| Build frontend based on UML diagrams | 14/Jan/2025     | Not Started    | TBD             |             |
| Integration with Backend, Testing | 1/Feb/2025      | Not Started    | TBD             |             |

###  3. use Large Lanuage Model, summerise the tab and groups tabs with similar/related info
- first needs to find a proper LLM api
- summerise the info in a tab, analyise its text info, image info and others through different LLMs. 
- Genthering similar/related tabs, like tabs for shopping and tabs for postgraduat degree application, summerise all the info of tabs in a group and give it a title
- **New**: generate an MindMap of a tab or a group of tabs if user ask to. This mind map is generate in markdown fromate through LLM, but displayed as a picture in user interface. This mind map can be shared to other users, together with web links of the info(only contain the final result).
- All the info above, including browsing history and all kinds of summerise, will be stored in a data base so that user can review it.

| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Investigate NLP Models          | 7/Feb/2025            | currently processing  | TBD             |   have tried to use GPT API to generate some summery of a tab    |
| Design and Fine Tune NLP Model  | 21/Feb/2025    | Not Started    | TBD             |             |
| Apply NLP Model into Backend    | 1/Mar/2025        | Not Started    | TBD             |             |

### 4. User LLM, provide a interface for user to ask question
- the material to answer this question comes from tabs that user is viewing/ have viewed, together with the knolege that the LLM has already have.

### 5. testing
| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Integration Test                | 28/Mar/2025        | Not Started    | TBD             |             |

### 6. report writing
| Subtask Name                    | Expected Completion Date | Current Status | Completion Date | Notes       |
|---------------------------------|---------------------------|----------------|-----------------|-------------|
| Intern Report                   | 13/Dec/2024      | currently processing  | TBD             |             |
| Final Report                    | 14/Apr/2025           | Not Started    | TBD             |             |

### What are these different to previous works?
- build a new backend and frontend different from google extention. Pytthon based Flask for backend, React for frontend.
- It can generate an mindmap after grouping all the related tabs。 For examples, display the advantage of different schools when search for postgraduate application, or analyise the prices and quality of each product when search for shopping, even Corporate campus recruitment information.
- It allow user to ask question based on current tab/ current groups of tabs/ known knowledge of the LLM.
- This time I will try to add LLM api that focusiong image analyise, increase the information from text based api.


### subtask

- understand basic requirement of the project
- read through previous works, literature search and review
- demo development, try differnt framworks
- project proposal writing
- write requirements
    - Usecase Diagrams
    - activity diagrams
    - hand draw prototype
- google chrome extension develop
    - learn how to build chrom extention
    - extract title of the tabs
    - extract text info of tabs
    - extract images info from tabs
- backend development
    - accept data from google chrom extention
    - database development
    - integration with frontend
    - apply NLP interface
- frontend development
    - learn how to use react
    - build frontend based on UML diagrams
    - integration with backend, testing
- NLP
    - Investigate NLP models
    - Design and fine tune NLP model 
    - apply NLP model into backend
- user evaluation, testing
    - integration test
- report
    - proposal
    - Intern report
    - Final report
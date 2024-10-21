# Visual Analytic for Sensemaking
https://kaixu.me/2024/08/28/analytic-provenance-for-sensemaking/


## Project Tasks

### 1. build a demo google chrom extention, with simple frontend and backend
- **why google chrom extention**: For better extract the data from users, including their Browsing History
- **sub tasks**: build an backend and frontend, ensure that user can have interaction with it.

### 2. extract what user is browsing on the Browser
- access the content of each tabs on the browser
- extract both text and images, but need to clean those advertesment if necessary
- show the info of this tab(title, low-image) on the user interface, and link this group of info with the previous tab's info

### 2.5 built a backendand a frontend
- user need to open this throug http8080....
- **why built a new backend and frontend instead of using chrom extention?**
    - more flexibility and extentionable, easy to achieve complex functions and implementing testing. 
    - Can implement and manten them individually.
    - It is easier and more flexble to use api form python comparing to javascripts
    - But still require to built a google extention to gain the user's info

###  3. use Large Lanuage Model, summerise the tab and groups tabs with similar/related info
- first needs to find a proper LLM api
- summerise the info in a tab, analyise its text info, image info and others through different LLMs. 
- Genthering similar/related tabs, like tabs for shopping and tabs for postgraduat degree application, summerise all the info of tabs in a group and give it a title
- **New**: generate an MindMap of a tab or a group of tabs if user ask to. This mind map is generate in markdown fromate through LLM, but displayed as a picture in user interface. This mind map can be shared to other users, together with web links of the info(only contain the final result).
- All the info above, including browsing history and all kinds of summerise, will be stored in a data base so that user can review it.

### 4. User LLM, provide a interface for user to ask question
- the material to answer this question comes from tabs that user is viewing/ have viewed, together with the knolege that the LLM has already have.

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
    - sequence diagrams
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
- report
    - Intern report
    - Final report
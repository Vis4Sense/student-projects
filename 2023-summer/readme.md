We will use this folder for the MSc and intern projects in summer 2023.

Please use this file for all the meeting notes. 

## Project chocie
- Aijing: to support end users, such as artists, to use generative AI models, such as stable diffusion (dalle2, midjourney), through web interface
- Meirong: Create a browser extension that provide end-to-end support for online shopping
- Xinhao: Create a browser extension to support the usage of LLM or generative AI models through their web interface
- Yu: Projection of provenance vector sequence
- Yuchen: Improve the design of the HistoryMap so the tree fits better within a Chrome side panel

# 1 Sep 2023

- Todo for all
  - Don't panic if not everything is completed
    - Describe in the report everything you tried, even it turned out to be not successful in the end
    - Explain why the problem is difficult
  - Upload the code (and data) to this GitHub repository
  - Dissertation
    - follow the sections in the overleaf template
    - Assume the reader knows nothing about your project (one of the markers will be), such as what sensemaking is, what is historymap, etc.
  - include more images/screenshots in the reports (so the other marker can understand your work better)
  - make a screen caputure video of your app work
  - include a link to your github repository (folder) in the dissertation (abstract, introduction, supplement materials, etc.)
  - make the app usable online if possible
- Yuchen
  - writing final report
  - the layout is still not working
- Xinhao
  - make sure chatGPT is using user uploaded data in the converstaion, especially when the data is larger than the prompt limit
  - test the system with data of different size, starting with something very small (a few rows) and increase the size gradually (dozens rows, hundreds rows, etc.)
  - Test the system with multiple questions for each dataset   
- Meirong
  - don't need to include parallet cooordinates if there is not enough time
  - automatically get all the (camera) data from each (camera) page a user opens:
    - assume user is always using the same website (such as Amazon)
  - automatically add the collected data to the visualisation.

# 25 Aug 2023

- Todo (for all)
  - start recruiting participants if you plan to have a user study (required for the final report)
  - 3-5 people for qualitative evaluation:
    - get the participants to use your tool to complete some task (prepare the dataset and task beforehand)
    - ask them some questions afterwards (prepare a list of questions beforehand)
- Aijing
  - working chrome extension to capture user input
  - Todo: save the time of capture, previous history, settings
  - Todo: let user go back to a previous save state (with text prompt and settings)
- Meirong
  - create a table that can display information about different cameras
  - Todo: use '+new' to add new column
  - Todo: instead of dropdown, get the information, such as 'brand' and 'price' directly from the webpage
  - Todo: option comparison: spider chart or parallel coordinate
- Xinhao
  - Learned about LangChain
  - Todo: Need to convert xlsx file to csv file
  - Todo: load the data anaylsis history
  - Todo: use conversion to ask the LLM to predict what the next step(s) is(are) after giving LLM a few examples first.
- Yu
  - Tried React and Vue
  - Todo: embeding the text with LLM and compare the result with BertSentence
  - Todo: calculate the importance of the edges and use edge width to show that
  - Todo: show the related information when mouse over a node/edge.
- Yuchen
  - Still trying to realise the layout
  - Will try to display the extension in a separate window (similar to the current sensemap) before trying using the side panel api


# 18 Aug 2023

Xinhao, Yuchen, Aijing, Kai

## Discussions
- Yuchen
  - try to use the chrome side panel api: https://developer.chrome.com/docs/extensions/reference/sidePanel/
  - try different layout libraries to see if there is a suitable layout
- Xinhao
  - need to do resit exam
  - foucs on 'LangChain: Chat with Your Data': https://learn.deeplearning.ai/langchain-chat-with-your-data/lesson/2/document-loading
  - use LLM to analyse sensemaking data: such as summarising what user is doing
- Aijing
  - no need to crawl the webpage, just use the chrome extension api should be able to get the text promotp and generated image
  - use 'content script' to get the prompt and image from the webpage
  - can use the chrome side panel api to show the extension: https://developer.chrome.com/docs/extensions/reference/sidePanel/
 
# 11 Aug 2023

Xinhao, Meirong, Yu, Aijing, Kai

## Discussions

- Aijing:
   - Adobe Firefly, or other options if it is difficult to get information
   - Need to develop (chrome) browser extension
- Meirong:
   - asked potential users about which chart is easier to understand
   - learning figma: finish and share the sketch
- Xinhao
   - llama2 local
   - Don't need further fine tuning
   - use the largest model that can run locally
   - research langChain
      - LangChain for LLM Application Development
      - LangChain: Chat with Your Data
      - https://www.deeplearning.ai/short-courses/
- Yu
   - improved sketch:
   - focus on the visualisation library for now, use Vue or React later if needed
   - Use the vector database from langChain to convert page text to vectors
- Yuchen
   - practicing chrome extension
   - layout library: chart.js, neovis.js, apache visualistion library, antv graph layout library, mxgraph, graphviz

# 4 Aug 2023

Present: Xinhao, Meirong, Yuchen, Yu, Aijing

## Discussions
- Yuchen: complete wireframe,
   - try to improve the vertical layout (sidebar): similar to windows explorer design
   - maybe consider has a pane at the bottom (horizontal layout):
      - there is no internal Chrome API to support (as far as I am aware)
      - maybe there needs to an option to swith between the horizontal and vertical layout.
## ToDo
- update the requirements and design sketch/wireframe based on the discussions during the meeting
- start the coding for first prototype (with only the bare minimal core functions)
- upload the requirements, design, and initial code to the this repository
   - Don't wait until everything is fully completed before uploading. This might be too late to change, which is mostly likely to happen.   

# 28 Jul 2023

Present: Xinhao, Meirong, Yuchen, Yu, Aijing

# Discussions
- Meirong: have a look of the visual design in the final report from Liujia and Qilin (under the folder 2022-2023)
- Xinhao: can use the latest open-source LLM such as Llama2 from Meta
- Yu: can use the data Luting collected (under 2022-2023)

# ToDo
- Kai to send Aijing the recording with Richard
- Everyone: by the next meeting:
   - Please keep your GitHub Project up-to-date
   - Please identify the specific user task that your project will support
   - Please create at least the first sketch/wireframe of the UI for your extension/tool.
   - Please add the task/user requirements (as markdown) and design wireframe (or the link to it) to the GitHub repository

# 21 Jul 2023

Present: Xinhao, Meirong, Yuchen, Ajing, Yu

## Discussion
- The project plan mark should be released next week. If not, please contact the module convenor Tim Muller.

## ToDo
- Make sure there is no overlapping between the tasks in the plan
- Update the plan tasks according to the project change, such as new things need to learn
- Make sure each task has a reasonble amount of time to complete.
   - It is not feasible to complete the coding needed for a prototype in a few days
   - Need to reduce the number of tasks if there is not enough time to complete all of the existing ones
- Complete the tasks in the plan and update the plan accordingly. 

# 30 Jue 2023

Present: Xinhao, Meirong, Yuchen, Ajing, Yu

## Discusion
- [GitHub](https://github.com/Vis4Sense/student-projects/blob/main/instructions/github.md)
- [IDE](https://github.com/Vis4Sense/student-projects/blob/main/instructions/ide.md)
- [Latex/overleaf](https://github.com/Vis4Sense/student-projects/blob/main/instructions/latex.md)
- [Literature review](https://github.com/Vis4Sense/student-projects/blob/main/instructions/literature.md)

## ToDo

Complete the tasks from last meeting.

# 23 Jun 2023

Present: Xinhao, Meirong, Yuchen, Ajing

Absent: Yu

# Discussions

# ToDo
- complete: prelimenary ethics form (deadline: 27 June)
- start: full ethics form (deadline: 5 July)
- start: project plan (deadline: 7 July)
- learn Git and GitHub
- learn Markdown
- Create a folder with your name under '2023-summer' for your project
- start: create a project plan using GitHub Projects and copy the tasks and milestones from the '[project plan template](https://github.com/Vis4Sense/student-projects/projects?query=is%3Aopen)'
- start: literature review

# Experts
- GitHub: Xinhao YANG
- Latex/overleaf: Yu HAO
- 
***(Template - the latest meeting is on top)***

# Meeting dates

## Participants

Present:

## Agenda and Discussion Points

- point1
- point2
- ...

## Action Points

- action1 (link to github issue 1)
- action2 (link to github issue 2)
- ...

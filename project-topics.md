# Project ideas and readings

## For all projects

### Background
- The genral project ideas are online at: https://kaixu.me/projects/. 

### Reading
- [Survey on the Analysis of User Interactions and Visualization Provenance](https://eprints.mdx.ac.uk/30220/6/v39i3pp757-783.pdf)
  - Provide the background and overview of existing work.
  - It has a [website](https://provenance-survey.caleydo.org/)

## Project: Projection of provenance vector sequence 
### Background and readings
- [Sensemaking Processes as High-Dimensional Vector Squences](https://kaixu.me/2022/05/23/visualising-the-sensemaking-space/)
  
### Ideas
- Visualise the online sensemaking provenance as vector sequences, i.e., apply provectories to browser history data;
- Visualise the Jupyter provenance as vector sequences, i.e., apply provectories to jupyter user log;
  - You should also go through the readings for ['Project: Jupyter Extension'](https://github.com/kaidatavis/student-projects/blob/master/README.md#project-jupyter-extension)
- Improve the vector sequence visualisation so it becomes easier to see patterns and understand what users are doing.
  - You should also go through the readings for ['project: browser extension'](https://github.com/kaidatavis/student-projects/blob/master/README.md#project-browser-extension)

## Project: Jupyter extension
### Background and readings
- [Human-Centred Data Science](https://kaixu.me/2021/01/23/machine-learning-provenance-for-hyperparameter-tuning/)
- [Human-AI Teaming: Qualitative Analysis and Generative Models](https://kaixu.me/2021/01/31/interactive-learning-for-document-coding/)

### Idea 
- Capture and visualise the user interaction logs in Jupyter using a Jupyter extension (similar to verdant, not the provenance vectors) 
  - to support tasks in machine learning model building, such as hyperparameter tuning
  - to support end users, such as artists, to use generative AI models, such as [stable diffusion](https://stability.ai/blog/stable-diffusion-public-release)

## Project: browser extension

### Background and readings
- [Visual Analytic for Sensemaking](https://kaixu.me/2021/01/31/analytic-provenance-for-sensemaking/)
- [Human-AI Teaming: Qualitative Analysis and Generative Models](https://kaixu.me/2021/01/31/interactive-learning-for-document-coding/)

### Ideas
- Create a browser extension to support the usage of LLM or generative AI models through their web interface
- Improve the design of the HistoryMap so the tree fits better within a [Chrome side panel](https://developer.chrome.com/blog/extension-side-panel-launch/)
- Create a browser extension that provide end-to-end support for online shopping
  - Start with online research (can use HistoryMap)
  - Automatically gather the required information, such as the price for different model
    - with web scraping or chatGPT
  - Create a visual comparison of different options
- A user study to compare the tree/hierarchy visualisation first used in SenesMap against the latest that is availalbe in popular browsers, such as tab grouping and [chrome 'journey'](https://blog.google/products/chrome/finding-answers-gets-better-chrome/).
- How to record the 'why': many rules/decisions are recorded without the 'why'. Overtime, the reasons become no longer valid, while the decisions/rules are still being followed, sometimes blindly. This project aims to see if there is any efficient way to record the 'why' that will not introduce too much extra work and can be easily used by other applications.
# Visual Analytic for Sensemaking
https://kaixu.me/2024/08/28/analytic-provenance-for-sensemaking/


## Project Tasks

### 1. build a demo google chrom extention
- **why google chrom extention**: For better extract the data from users, including their Browsing History
- **sub tasks**: build an backend and frontend, ensure that user can have interaction with it.

### 2. extract what user is browsing on the Browser
- access the content of each tabs on the browser
- extract both text and images, but need to clean those advertesment if necessary
- show the info of this tab(title, low-image) on the user interface, and link this group of info with the previous tab's info

###  3. use Large Lanuage Model, summerise the tab and groups tabs with similar/related info
- first needs to find a proper LLM api
- summerise the info in a tab, analyise its text info, image info and others through different LLMs. 
- Genthering similar/related tabs, like tabs for shopping and tabs for postgraduat degree application, summerise all the info of tabs in a group and give it a title
- **New**: generate an MindMap of a tab or a group of tabs if user ask to. This mind map is generate in markdown fromate through LLM, but displayed as a picture in user interface. This mind map can be shared to other users, together with web links of the info(only contain the final result).
- All the info above, including browsing history and all kinds of summerise, will be stored in a data base so that user can review it.

### 4. User LLM, provide a interface for user to ask question
- the material to answer this question comes from tabs that user is viewing/ have viewed.

### What are these different to previous works?
- It can generate an mindmap after grouping all the related tabs。 For examples, display the advantage of different schools when search for postgraduate application, or analyise the prices and quality of each product when search for shopping, even Corporate campus recruitment information.
- It allow user to ask question based on current tab/ current groups of tabs/ known knowledge of the LLM.
- This time I will try to add LLM api that focusiong image analyise, increase the information from text based api.

生成一个最终的思维导图/报告，包括分析物体的优劣等等，并标注来处（即用户访问过的网址）,只显示搜索的final result

增加图片识别gpt的api

每打开一个标签页，先gpt分析主要内容，展示给用户；同时保留交流框，用户有不明白的词的时候，全网搜索/结合前面的标签页搜索，返回给用户
（插件窗口的持续可见性和可交流性）
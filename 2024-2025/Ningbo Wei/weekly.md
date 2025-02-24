# Ningbo's weekly report

## week01, Sep 30th
- busy with IELTS test, only have a brife view at previous students' work

## week02, Oct 7th
- joined the meeting, get to know ways to access some LLM api.
    - https://www.gradio.app/; Gradio is the fastest way to demo your machine learning model with a friendly web interface so that anyone can use it, anywhere!
- set up a minimal working demo

## week03, oct 14th
- learn the hello world tutorial for an introduction to the google extension development workflow.
- Spend time learning javascript and some front-end knowledge, like DOM
- build a small demo extracting web titles

## week04, oct 21st
- meeting
    - evaluation, can try to use interview as a way
    - it is better to mention the gap between previous works in the proposal
    - creat a bench mark, use pre-set web browsing data to check gpt's discription
- finish the proposal
https://www.overleaf.com/project/670c3752a42288f6df84210c

## week05, oct 28th
- meeting
    - do data management plant
        - data should be stored at one drive. If on a local machine, please say "I have set some passwords"
        - delete all the personal data after project end.
        - 对data脱敏，name -> user1
    - do interview
        - find target users, shopping/student/tecnichal
        - ask question, 2-3 people, know what they want
- get api run correctly

## week06, Nov 4th
- meeting
    - reading
        - go to IEEE, ACM or google schoolar
        - choose the one with highrt impact, the latest one
        - make use of some tools, manage those materails
- plant:
    - data collecting and processing
    - user questions
    - draw a simple user interface
- have done:
    - have drawn an user interface
    - make a questioner

## week07, Nov 11th
- meeting

- plant：
    - data collection and processing
    - benchmarks
    - visit **historymap** github page, view the code
- have done
    - finish drawing offical uasecase diagram and prototype
    - add a frontend of minmial demo
    - try to extreact data from a web page as a benchmark Material

## week08, Nov 18th
- meeting
    - advise to try longchain
    - try library https://antv.antgroup.com/ , https://www.sigmajs.org/, https://github.com/maxGraph/maxGraph and https://jgraph.github.io/mxgraph/
- plant：
    - update minimal demo
- have done
    - successfully extract basic text information from two webpage(wikipek and amazon)
    - successfully use GPT's API to generate a short summry base on webpage's text information
    
## week09, Nov 25th
- meeting
    - advise to only extract text info within 'main' tag inside the HTML file when extracting text information from a webpage
    - davise to manage the readme file, re-structer those subtasks and add them with a date.
- plant：
    - try to extract text info within 'main' tag by python(First)
    - refactor this "extract" function using javascript, sent these text info to the backend(First)
    - manage the readme file
    - learn react and start to built a frontend(First)
    - strat to do the intern report
- have done
    - manage the readme file
    - successfully extract text info within 'main' tag by python, together with an outline in markdown format
    - successfully refactor this "extract" function using javascript, though with some bugs (eg.sleeping pages(read it when open), or pages that display a PDF file instead of a webpage, but some can be online)
        - time
        - can give up PDF file reading, just try some library
    - have learnt react and built a simple frontend

## week10, Dec 2nd
- meeting
    - use overleaf default template, decription of work(project desciprtion)可以往后面放一放或者和design放在一起; Introduction为back ground；可以加一个future plant
- plant：
    - fix the bugs in prototypes
    - do the intern report
- have done
    - question
        - 使用了腾讯混元大模型API，是否要把api文档作为reference放进去？？？不妨总觉得怪怪的(eg.收费比gpt低很多)
    - successful apply Hunyuan model(both text and images related)
    - have try amazon's SW3 cloud based storage to support image related api

## week11, Dec 9nd
- meeting
    - can try `qianwen` apis and their open sorce LLM, can try to delopy them on school's server
    - try to find a benchmark for multymodel, especially the one for text+image. This helps pick the best LLMs.
    - suggest to built the front-end first as a minimal demo, then pick the best LLM.
- plant：
    - finish interim report
    - modify the time managment plant
- have done
    - interim report and plant

## week12, Dec 16nd
## week13, Dec 23nd
sleeping and having fun...

## week14, Dec 30nd
- have done
    - improve the chrome extension.
        - It can now load new opened tab immediatly(but have new problem)
        - able to extract image in both url and base64
    - start building offical front-end based on react
        - creat a component displaying tabs 
- question
    - url of a tab could change, eg. google map(it url will changed base on cordinate). Not important, but might need to be solve in the future. 


## week15, Jan 6th and week16, Jan 13th
- no meeting this week
- find a specific task and modiy the front-end plan
- check the chrome api for handling re-direct
- consider using google chrome as the backend, instead of using python-flask. Additionally, this allowed using browser storage.


## Jan 20th
- have done
    - choose specific task: planing a group holiday ( a task with multiple tabs; needed for group work; might have some sub-task(Hierachical classtering))
    - successfully removed the python-flask based back-end
- plant to do
    - Draw a front-end special design for the holiday palning(may be can built a map function? 地图功能), then try to finish the front-end for a minimal demo (key main things!)
        - just start with one task one person
        - not just location, but also days or aim
    - try to apply chrome storage
    - try to make use of deepseek api(not really critical, but intersting)

## Jan 27th
- have done
    - add manully refresh button in the new front-end/back-end
    - apply LLM api into demo through javaScripts
    - fix bugs in the front-end, there is not latency in updating tabs
    - plant about grouping:
        - start from one person 
        - seperate as city (eg. traveling to tokyo, Osaka, Nagoya, Mount Fuji)
            - why not days? People usually travel a city per day or servel day a city. Use city as parameter is much better and easier for algorithm to do classifycation
            - can develop Hierachical in the future(eg. ticket booking, hotel booking, different small location in a city)
            - user can have some dinfe about city(adding some user control)
- plant to do:
    - try to apply chrome storage
    - develop the function of tab grouping, start from traveling with different city
    - Deepseek api(not really critical, but intersting)
    - update a new prototype based on traveling, inclding Hierachical strcuture
- plant to do

## Feb 4th
- have done
    - add a new protoyye
    - add new function: manully added tasks
    - test using api in clustering of traveling citys
    - successfully applying chrome storage (can do in sycn)
- plant to do:
    - apply clustering using api(without Hierachical, without user personal setting)
        - first, fix bugs in adding tabs to mindmap
        - second, automatically generate a summary when loading a tab. Delete the plain text information, inorder to reduce the stress of google loacl sotrage
    - add function of task summary and chat box
    - finished a minimal prototype in two weeks
    - try to use chrome.storage.sync, instead of the local one
- question
    - is it ok to use gpt api doing clustering?
        - yes, no problem. But please leave an option for user to set their api key, or provide a own severice
    - how is the new prototype
        - delete a block which displaying subtask, see prototype 3.0
    - the management of background and front-end

## feb 11th
- have done 
    - add tab grouping function(focusing on traveling)
    - tabs are generate summary automatically
        - for the convience of tab grouping
        - decrease the data storage(text of a page, image-base 64)
- to do
    - use gpt-4o-mini
    - reduce the token needed for a summary
    - about the tab clustering, allow user personalised
    - task summary & QA chat box

## Feb 18th
- have done
    - acheive using gpt-4o-mini
    - reduce the character neeed for summary(combine the process for generating two summarise of a tab; apply prompt engineering to lead the gpt guess what the full webpage is talking about before doing summary)
        - typically, prompt tokens 870s, completion_tokens 120s, totally 1000s
    - successful tried chat box in python
- problem
    - gpt-4o-mini is easy to meet the token limitation, sometime have to wait for 50 seconds(never meet this problem in gpt-3.5, and this is an ergen error, happend ramdomly)
        - increas the quota? or sending the request one by one?
        - quota of gpt-4o-mini should be ?
    - the output format changed, 3.5 return json content in text directly, while 4o return json content in markdown
## Notes - 31 July 2023

- Update project plan 
- Issue: cannot access the cell output from the extension
   - **Load the saved prompts and output images from a local folder**
   - Ask Klaus to see he did this before
   - Check Jupyter extension examples to see if there is something similar
   - try imageviewer/IImageTracker
   - ...
- Issue: to get Disco Diffusion notebook working locally
   - Try something like this https://github.com/MohamadZeina/Disco_Diffusion_Local
   - Use any other generative image models that can be run locally (we don't need to use disco diffusion)

 

## Notes - 21 July 2023

- [ ] add more wireframes to illustrate user interactions with the extension, or use the figma to mock interaction
- [ ] start with the single column design
- [ ] load the existing prompts and images
- [ ] for each prompt, save and display all the steps (each step is an image)
   - [ ] Some of the steps can be shown in smaller size to reduce the space needed.
- [ ] Complete an extention prototype (minimal viable prototype or MVP) by next meeting.


## Notes - 14 July 2023

### To Do
- [ ] create wireframes with two different layouts:
   - [ ] column based: each column is a version (the current desgin of loops)
   - [ ] row based: each row contains only the text prompt and resulting image(s)
   - The row layout might be harder to compare the (prompt) difference between the versions, and a solution could be use 'text diff' such as crossing out removed word and showing new word in a different colour.
- [ ] Show Richard the wireframes for comments
- [ ] for the row-based layout, check how much efforts are needed to implement it in loops
   - If too much efforts, implement the row layout as a separate extension? 
- [ ] recreate the current history (saved prompts and images) in the extension
   - This needs to be moved later if implmenetion is needed, such as creating the row layout.
     
## Notes - 4th July 2023 (Richard)
Issues when using Disco Diffusion:
- Running time is quite long
- Richard often goes do something else when waiting for the run to finish (How would this impact the creative process? Would a much shorter running time have a significant positive impact? A user study?)
- Not always clear why the prompt changes leads to the image change (Example: adding ‘x-ray’ to the prompt led to skulls appearing in the images (maybe x-ray images often have skull?))
- The model can be quite literature (Example: putting letter ‘X’ in the image when ‘x-ray’ is mentioned in the prompt)
- The model seems to misinterpret the context of the prompt (Example: the phrase ‘head and shoulder’ was used to describe the composition of the image, but the image included the shampoo with the same brand name.)
- The model doesn’t always understand (the intention in) the prompt (Example: having ‘portrait’ in the prompt does not produce a portrait)
- Saving prompts and images to a folder seems not the most efficient way to manage and use the exploration history.
- There are many parameters and options not explored
- Potential needs to ‘debug’ the prompt (Example: forgot to put a colon before the weight, so the weight is ignored)
- Want to know more about how the model works to get more out of the model
- Not sure about the recommendation made by the model (Is the recommendation similar/related to prompt tried?)
- Not happy about 80-90% of the image generated, even after becoming more experienced with the model, the percentage of non-useful images doesn’t really drop

## Richard's Requirements and Challenges
Richards requirements involve the following:
- Clear Prompt-Image Relationship: Richard has observed that in multiple instances, changing the prompt does not yield the expected image changes, he would like a clearer and more consistant relationship between the prompts written and the generated images. However, at the same time, the unexpected image changes do provide him with a more creative approach to using the Disco model.
- Deeper understanding of the model: Richard wants to learn more about how the model works in order to maximise its potential and extract more value out of the model's capabilities.
- More efficient management of exploration history: Richard currently saves prompts and images to a folder which is deemed inefficient for managing what has been done and tested, he would like to explore a more effective approach to track and utilise past exploration results.
- Higher percentage of useful generated images: Currently Richard expresses that he is dissatisfied with the quality of the generated images, around 80-90% of the images produced are not useful or desired.
- Less need for debugging: Richard encounters issues with a prompt not being fully processed during the cases of forgetting to put a colon before a weight which results in that weight being ignored and having to re-run the model.
- Improved running time: Richard finds the current running time quite long, which affects his productivity. He would like to explore the possibility of reducing the running time to have a more efficient workflow
- Improved creative process: Richard is concerned losing the train of creative thought while waiting.

## Goals that the extension will achieve

### 1st Stage:
- History capture and display: 
- History Management: The extension will provide a more efficient way to manage and utilize the exploration history. It will offer intuitive tools for organizing, searching, and retrieving past prompts and generated images. This functionality will save valuable time and effort when accessing and utilizing previous experiments.
- Efficient Exploration: The extension will enable users to explore the capabilities of the Disco model more effectively. It will provide a streamlined interface to track and manage the exploration history, allowing users like Richard to easily revisit and build upon their previous experiments.
- Enhanced Control: The extension will allow users to have better control over the output of the model. By providing a user-friendly interface to steer and modify prompts, it will enable users to fine-tune the generated images according to their specific requirements more efficiently.
- Ability to write notes/feedback of attempted prompts/output

### 2nd Stage:
- ??Prompt Debugging: The extension will offer prompt debugging functionality to help users identify and rectify issues with their prompts. It will provide feedback and suggestions to ensure that the intended instructions are correctly interpreted by the model, thus avoiding unexpected or undesired results. (Perhaps by suggesting to install a debugger extension)
- Improved Image Generation: The extension will assist users in creating the desired images. By leveraging the exploration history and providing insights into the prompt-image relationship, it will help understand the factors that influence the model's output. This understanding will enable users to make more informed decisions and generate more desired images.
- Provide recommendations based on user annotation by understanding the user's notes and outputting a recoomnded prompt or weight


Potential Additions:
- Add a toggle list to transverse between versions
- Side by side comparison similar to Git
- Notification system to alert the user of completion
- Tips to running a notebook, such as the recommendation to change runtime type (CPU to GPU)
- Documentation access?
- Hyperparameter changes via the library UI
- Notes/Comment tracking of each version so the user can notate how their changes have impacted different versions and for recalling purposes
- Prompt retrieval function from a previous version 

## Notes - 22 June 2023 (Klaus)
Issues from Loops:
- Order of execution
- Watch process to recomplie 
- Using a devcointarer for the extension

Installation requirements to use Loops:
- Install Docker
- NodeJS
- https://github.com/jupyterlab/extension-template
- Python 3.9
- Copier
- Trrack extension
- HTML Diff Extension by Armantang


## ToDo
- [x] 1. Daniel: Update the project plan
- [x] 2. Daniel: have a look of the [trrack library](https://trrackjs.vercel.app/) 
- [x] 3. Daniel: have a look of react https://react.dev/learn
- [x] 4. Daniel: put the recording of the meeting with Klaus somewhere online (but not github as the video file might a bit too big).
- [x] 5. Kai: arrange an observation/interview with artist
- [x] 6. Daniel: move the code repository here
- [x] 7. Daniel: read the Verdant paper
- [x] 8. Daniel: understand more about the Loops code
- [ ] 9. Explore how the disco diffusion notebook is setup and similar user studies
- [ ] 10. Research into prompt engineering of stable diffusion
- [ ] 11. Compare users prompts and how the variation is altered

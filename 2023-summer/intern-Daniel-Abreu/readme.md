## Notes - 22 June 2023 (Klaus)
Issues from Loops:
- Order of execution
- Watch process to recomplie 
- Using a devcointarer for the extension



 

Installation Process to use Loops:
1-Install Docker
2-NodeJS
3-https://github.com/jupyterlab/extension-template
4-Python 3.9
5-Copier
6-Trrack extension
7-HTML Diff Extension by Armantang

 
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


Potential Additions:
- Add a toggle list to transverse between versions
- Side by side comparison similar to Git
- Notification system to alert the user of completion
- Tips to running a notebook, such as the recommendation to change runtime type (CPU to GPU)
- Documentation access?
- Hyperparameter changes via the library UI
- Notes/Comment tracking of each version so the user can notate how their changes have impacted different versions and for recalling purposes
- Prompt retrieval function from a previous version 


## ToDo
- [x] 1. Daniel: Update the project plan
- [x] 2. Daniel: have a look of the [trrack library](https://trrackjs.vercel.app/) 
- [x] 3. Daniel: have a look of react https://react.dev/learn
- [x] 4. Daniel: put the recording of the meeting with Klaus somewhere online (but not github as the video file might a bit too big).
- [x] 5. Kai: arrange an observation/interview with artist
- [ ] 6. Daniel: move the code repository here
- [x] 7. Daniel: read the Verdant paper
- [x] 8. Daniel: understand more about the Loops code
- [ ] 9. Explore how the disco diffusion notebook is setup and similar user studies
- [ ] 10. Research into prompt engineering of stable diffusion
- [ ] 11. Compare users prompts and how the variation is altered

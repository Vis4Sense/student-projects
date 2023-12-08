# Updated requirements for MVP 

-	Image generation 
o	Use for both settings and characters – both realistic and fantastical/surrealist artwork/imagery
o	Control over setting + character details
o	Control over image style 
o	Control over mood/tone of image (i.e. through colour?)
o	Control over degree of randomness of images 
o	Negative prompt field
o	Advanced settings (i.e. generation steps, model, seed, prompt strength, width and height of image) can be optional/hidden unless needed but have default values set
o	Image count – generate between 1 to 4 images
o	Option to adjust positive and negative weighting for different keywords in prompt
o	Some way to fix issues with incorrect limbs or other issues with physical appearance of character in generated images
o	Make it clear why images are flagged as inappropriate and suggest alternative prompts or parameters to fix this
o	Make it clear how advanced settings will affect image without user having to read extensive documentation 
-	Prompt expansion suggestions – for regular prompt and negative prompt
-	User interactions being logged to a database ⇒ this is to enable the prompt-image history log (and later, provide more intelligent prompt suggestions)
-	Unintrusive/optional feedback on images to improve system performance
o	Feedback mechanism could be rating system out of 10 and optional space for user to explain why they gave that rating
	Based on this feedback, the prompt suggestions in future iterations will change and improve.
o	Could also specify to the AI that it has generated certain aspects of the image correctly (i.e. blonde hair) and specify what aspects of the image should be changed/corrected in subsequent generations
-	Image display
o	View prompt-image pairs (prompting history)/group images together by prompt to track progression
o	Click on the image and expand it to view it in a larger size with information about the prompt, seed, and other parameters used to generate that image
![image](https://github.com/Vis4Sense/student-projects/assets/66835338/847ba6e4-cfef-4aec-a574-57ac5009b285)

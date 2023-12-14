# Updated requirements for MVP 
## Research requirements



## Implementation requirements
- Image generation
    - Use for both settings and characters – both realistic and fantastical/surrealist artwork/imagery
    - Control over setting + character details
    - Control over image style
    - Control over mood/tone of image (i.e. through colour?)
    - Control over degree of randomness of images
    - Negative prompt field
    - Advanced settings (i.e. generation steps, model, seed, prompt strength, width and height of image) can be optional/hidden unless needed but have default values set
    - Image count – generate between 1 to 4 images
    - Option to adjust positive and negative weighting for different keywords in prompt
    - Some way to fix issues with incorrect limbs or other issues with physical appearance of character in generated images
    - Make it clear why images are flagged as inappropriate and suggest alternative prompts or parameters to fix this
    - Make it clear how advanced settings will affect image without user having to read extensive documentation
- Prompt expansion suggestions – for regular prompt and negative prompt
- User interactions being logged to a database ⇒ this is to enable the prompt-image history log (and later, provide more intelligent prompt suggestions) **(IMPLEMENTATION REQUIREMENT)**
- Unintrusive/optional feedback on images to improve system performance
    - Feedback mechanism could be rating system out of 10 and optional space for user to explain why they gave that rating
        - Based on this feedback, the prompt suggestions in future iterations will change and improve.
    - Could also specify to the AI that it has generated certain aspects of the image correctly (i.e. blonde hair) and specify what aspects of the image should be changed/corrected in subsequent generations
- Image display
    - View prompt-image pairs (prompting history)/group images together by prompt to track progression
    - Click on the image and expand it to view it in a larger size with information about the prompt, seed, and other parameters used to generate that image **(IMPLEMENTATION REQUIREMENT)**

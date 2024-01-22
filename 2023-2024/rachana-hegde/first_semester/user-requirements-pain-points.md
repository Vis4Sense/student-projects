# User requirements

- Storyboard where user can arrange images and also add some text to describe each scene.
- Moodboard feature - something like Pinterest - can organize or filter the content in it. Can make a moodboard for images related to one project
- Image generation
    - Use for both settings and characters – both realistic and fantastical/surrealist artwork/imagery
    - Control over setting + character details
    - Control over image style
    - Control over mood/tone of image (i.e. through colour?)
    - Control over degree of randomness of images
    - Negative prompt field
    - Advanced settings (i.e. generation steps, model, seed, prompt strength, width and height of image) can be optional/hidden unless needed but have default values set
    - Option to adjust weighting for different keywords in prompt
    - Some way to fix issues with incorrect limbs or other issues with physical appearance of character in generated images
    - Make it clear why images are flagged as inappropriate and suggest alternative prompts or parameters to fix this
    - Make it clear how advanced settings will affect image without user having to read extensive documentation
- Prompt expansion suggestions
    - Also suggestions for prompts to create new characters/settings based on existing information about the writing project and the prompt-image history saved
- Suggestions for writing negative prompt and making it more effective
- Caption generation for images – i.e. dialogue, plot points, character description – this could be in a specific writing style, tone, etc.
    - Note - Need to be able to provide enough context to generate useful plot points.
- Save, export and organize images - save images locally, view prompt-image pairs (prompting history)/group images together by prompt to track progression
    - Creating folders in the app to organise images (and prompts) by projects
    - Image visualisation map - where the images are clustered/grouped based on similarities, filtering/sorting options
- Unintrusive/optional feedback on images to improve system performance
    - Feedback mechanism could be rating system out of 10 and optional space for user to explain why they gave that rating
        - Based on this feedback, the prompt suggestions in future iterations will change and improve.
    - Could also specify to the AI that it has generated certain aspects of the image correctly (i.e. blonde hair) and specify what aspects of the image should be changed/corrected in subsequent generations
- Instead of having a tutorial, can have text show up when the user hovers over a button and this information is there for each aspect of the tool. Or a series of prompts that pop up when you start using the app/website to explain how different features work. (Note: This is similar to how DreamStudio UI is designed.)
- Login/account functionality
- Application is a website
- Image visualisation map - where the images are clustered/grouped based on similarities, filtering/sorting options
- User interactions being logged to a database ⇒ this is to enable the prompt-image history log
- Option to copy paste prose (from a story) directly into prompt field and it’s turned into a prompt

**Ideas for additional features**

- A feature for randomly generating characters/settings based on the genre
- Make it possible for user to copy paste text directly from story/writing into the prompt field and automatically edit this prompt
- Option to upload images to generate images based on them (There’s an image to image endpoint in the API I think)
- Option to upload external images to the mood board and storyboard
- Implement some sort of chatbot feature - maybe user can tell GPT that they don’t want certain details so GPT will recommend the negative prompt based on that or the user can tell GPT what the issue is - i.e. “XYZ is missing from the image” and GPT can suggest a way to reword the prompt to get the right image?
- Save/export storyboard as a PDF file
- Have storyboard templates based on the 3 act structure which help you get started

# Pain points

- Not sure which keywords to use to get more relevant images, not sure how specific prompt has to be / frustrated that it ignored some of the keywords in the prompt
- (Unequal) weighting of keywords in the prompt (and not having a way to adjust this) – wanted more cohesive images
- Not sure how much to specify when using the negative prompt parameter – i.e. how many pillars, windows, etc. It isn’t annoying but takes more effort.
- Negative prompt didn’t prevent certain things (i.e. men) from being included in image
- AI messed up the limbs for one of the characters in one of the generated images
- Didn’t like image generation websites that take too long to produce image
- Opted not to adjust the generation steps number to avoid taxing the system – but also not sure how this works exactly
- Could take more effort to generate realistic images than to find them with Google image search
- Issue with a desktop application is their laptop is old/slow. Also memory and storage are concerns when downloading applications from Internet.
- Struggled to generate ugly or non-conventionally attractive people with disfigurements, bad skin, or scars. Or people with nonstandard skin tones – i.e. grey.
- AI doesn’t improve images based on how satisfied you are with the previous image so it’s difficult to get an image where all of the details are correct.
- Lots of rules for structuring prompts for tools like Midjourney – need to read a lot of documentation to understand it. Need to spend a lot of time to learn how to write prompts.
- Struggled to find a style option (in Dreamstudio) that suited their needs.
- Most of the generated images (except for two) were flagged as inappropriate and it was unclear why the images were considered inappropriate. Modifying the prompt didn’t have any effect.
- The features in the advanced settings (i.e. prompt strength and generation steps) aren’t explained well so can’t figure out how altering them will affect the image (without reading documentation.)

CONCLUSIONS

- Priority is finding ways to reduce the effort/mental burden on the user.

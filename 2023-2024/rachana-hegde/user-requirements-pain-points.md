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
- Prompt expansion suggestions
- Suggestions for writing negative prompt and making it more effective
- Caption generation for images
- Generic filler dialogue to accompany image
- Save, export and organize images - save images locally, view prompt-image pairs (prompting history)/group images together by prompt to track progression
    - Creating folders in the app to organise images (and prompts) by projects
    - Image visualisation map - where the images are clustered/grouped based on similarities, filtering/sorting options
- Unintrusive/optional feedback on images to improve system performance
    - Feedback mechanism could be rating system out of 10 and optional space for user to explain why they gave that rating
- Instead of having a tutorial, can have text show up when the user hovers over a button and this information is there for each aspect of the tool. Or a series of prompts that pop up when you start using the app/website to explain how different features work. (Note: This is similar to how DreamStudio UI is designed.)
- Login/account functionality
- Application is a website
- Image visualisation map - where the images are clustered/grouped based on similarities, filtering/sorting options
- User interactions being logged to a database ⇒ this is to enable the prompt-image history log

**Ideas for additional features**

- A feature for randomly generating characters/settings based on the genre
- Make it possible for user to copy paste text directly from story/writing into the prompt field and automatically edit this prompt
- Option to upload images to generate images based on them (There’s an image to image endpoint in the API I think)
- Option to upload external images to the mood board and storyboard
- Implement some sort of chatbot feature - maybe user can tell GPT that they don’t want certain details so GPT will recommend the negative prompt based on that or the user can tell GPT what the issue is - i.e. “XYZ is missing from the image” and GPT can suggest a way to reword the prompt to get the right image?
- Save/export storyboard as a PDF file
- Suggest plot points/dialogue/character description based on generated images
- Have storyboard templates based on the 3 act structure which help you get started

# Pain points

- Not sure which keywords to use to get more relevant images, not sure how specific prompt has to be
- (Unequal) weighting of keywords in the prompt (and not having a way to adjust this) – wanted more cohesive images
- Not sure how much to specify when using the negative prompt parameter – i.e. how many pillars, windows, etc. It isn’t annoying but takes more effort.
- Negative prompt didn’t prevent certain things (i.e. men) from being included in image
- AI messed up the limbs for one of the characters in one of the generated images
- Didn’t like image generation websites that take too long to produce image
- Opted not to adjust the generation steps number to avoid taxing the system – but also not sure how this works exactly
- Could take more effort to generate realistic images than to find them with Google image search
- Issue with a desktop application is their laptop is old/slow. Also memory and storage are concerns when downloading applications from Internet.

CONCLUSIONS

- Priority is finding ways to reduce the effort/mental burden on the user.

# Updated requirements list
## Research requirements
1. The images generated should be useful for the brainstorming and outlining stages of the writing process.
    1. Images of characters and settings should help immerse the writer in the story and act as scene inspiration or reference points. The images can enable the writer to improve their description and be shared with others to help them visualise the story (i.e. Dungeons & Dragons players).
    1. It should be possible to control specific details of images of settings and characters. For example, the user can add specific objects to an image or traits (skin colour) to a character’s appearance. More specifically, if a user is writing a novel with a corporate setting, they would like to see details of the types of appetizers people are eating at networking events to produce more accurate descriptions of those scenes in their novel.
    1. The character art needs to be inclusive and diverse to enable writers to avoid incorporating stereotypes or clichés into their work and consequently have better representation. E.g. Generating images of characters with physical disfigurements.
1. The application can help address writer’s block. **(Kai: I really like the idea of helping with writer's block, though I am not sure I understand the example)**
   1. For example, there can be image captions containing dialogue, plot points or character description in a specific writing style to act as writing prompts.
   1. Or there can be images that will enable the user to incorporate plot twists into their story.
   1. Alternatively, the images can act as writing prompts which promote freewriting which is a prewriting exercise where the individual will write nonstop for some time and this can enable them to experiment with different ideas. 
1. The image must be generated quickly and easily with less effort than it takes to find images via Google search or through websites such as Pinterest. This mainly applies to realistic images because it is relatively easier to find relevant images for settings when writing realistic fiction. The user should be able to get images that align with their vision without having to engage in excessive trial and error. **(Kai: image generation will always be slower than image search? Maybe only use image generative when you can't a suitable image from search? Maybe use search results as the starting point/input for generation?)**
1. Unintrusive (and/or optional) feedback on images is used to improve system performance. For example, better (more relevant) prompt suggestions will be provided, image quality and image relevance will improve, or likelihood of errors will decrease during future usage of the application. Alternatively, the user can specify which aspects of the image are generated correctly (i.e. blonde hair) and which aspect should be changed/corrected and this will produce more accurate character art.
1. The storyboard feature will facilitate plotting stories in genres such as realistic literary fiction and fantasy. The writer could explore themes, character arcs, storylines, worldbuilding (i.e. magic systems, fantasy maps, illustrating landscapes and environments) using a combination of generated imagery and textual description (written by them).

## Implementation requirements
1. The application integrates a prompt engineering workflow with the writer's existing writing process. For example, it allows users to copy and paste paragraphs of text from their story directly into the prompt field with minimal editing, thereby minimizing distractions and keeping the focus on writing.
1. Image generation
    1. Control over image style and mood
    1. Control over degree of randomness of images
    1. Negative prompt field
    1. Advanced settings (i.e. generation steps, model, seed, prompt strength, width and height of image) can be optional/hidden unless needed but have default values set
    1. Image count – generate between 1 to 4 images
    1. Option to adjust positive and negative weighting for different keywords in prompt
    1. Some way to fix issues with incorrect limbs or other issues with physical appearance of character in generated images
    1. Make it clear why images are flagged as inappropriate and suggest alternative prompts or parameters to fix this
    1. Make it clear how advanced settings will affect image without user having to read extensive documentation
1. Prompt expansion suggestions – for regular prompt and negative prompt
1. User interactions being logged to a database ⇒ this is to enable the prompt-image history log (and later, provide more intelligent prompt suggestions?) **(Kai: or just saving to a file?)**
1. Image display
    1. View prompt-image pairs (prompting history)/group images together by prompt to track progression
    1. Click on the image and expand it to view it in a larger size with information about the prompt, seed, and other parameters used to generate that image

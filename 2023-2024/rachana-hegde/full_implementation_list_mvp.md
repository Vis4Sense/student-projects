# MVP Full Implementation List

**Overall Time Frame: February 20 – April ??**

***RQ 1: How can an AI image generation application assist writers with overcoming writer’s block?***

***RQ 1a: How can a generative AI application support creative writers with limited AI knowledge in fine-tuning diffusion models for consistent character generation?***

# Feb 25 - Mar 15

## Project creation page

- Users can enter information: title, genre, themes, story summary, and image style preference
- Save data in local storage
- Click button to create new storyboard

## Feature: Prompt Editing

- **Test out prompt design strategies for generating consistent character art in chat GPT. Request GPT-4 to edit prompts in different ways and use them to generate images with Dall E 3. * Completed**
    - **Determine whether I can use prompt design to get 1-3 character(s) consistent across multiple settings and how to make this happen more reliably. * Completed**
- **Read OpenAI documentation for image generation with Dall E 3 and Dall E 2 * In Progress**
- Application makes API call to GPT-4 which will edit user entered prompts.
    - Tell GPT to adapt the prompt to generate a new image of the character in a different setting while ensuring their appearance remains consistent
- LLM prompting templates – make a few and test them out

## Feature: Image Generation

- User can select and download images
- User can upload images to edit them with Dall E 2 API
- Test whether inclusive and diverse character art can be generated with Dall E 3 and how to achieve this.
- Application submits edited prompts to DALL·E 3 via API to generate 3 images at a time. ()
    
    It will generate 1 image for now
    
- Give prompt improvement suggestions to user
- User can approve suggestions
- Prompt is updated when user selects and approves suggestions
- Fields for user to edit during image generation:
    - Character name
    - Character description that has information about:
        - Ethnicity
        - Age
        - Gender
        - face shape
        - eye color
        - hairstyle and hair color
        - height
        - Emotion
        - Accessories
        - Personality traits
        - Unique characteristics (i.e. tattoos, scars)
        - Additional details
    - Option to add up to 3 characters to appear in image (with the caveat that the image quality might not be totally accurate)
        - Specify relationship(s) between characters
    - Regular prompt
    - Negative prompt
    - Setting description – location, general environment (i.e. city/urban, nature, building interior), time period
    - Art Style
    - Mood – i.e. romantic, whimsical, dark, suspenseful
    - Photo angle - wide angle, full body, portrait, etc.
    - Candid shot – yes or no? (should character be looking at viewer/doing model pose or posed more naturally)
    - *Not sure if I can control: degree of randomness, generation steps, seed, prompt strength, weighting
- Add tool tips when user hovers over fields explaining what each parameter does
- The LLM automatically fills out additional details (based on user entered information in other fields) or the user can randomly generate ideas for fields if they don’t want to fill them out. **optional**
- Display images: show prompt-image pairs

# **Mar 16 - 20**

### Storyboarding

- Scene divs: drag and drop for images and text, add/remove, edit scene title and description text **Completed**
- Upload images **Completed**
- Save changes to local storage **Completed**

# **Estimated time to complete: 1.5 weeks**

## Feature: Generating plot ideas with GPT-4

- Generate plot suggestions using LLM
    - Send prompt containing story context from project creation page
        - Include information from the storyboard in the context
        - Include prompts used to generate images for the storyboard in the context
        - Summarize some of the content in the context to reduce token usage
    - Format responses from LLM to parse it more easily
- User can select plot ideas to be converted to image prompts
    - Create prompt template to send plot idea to LLM with instruction to convert to image prompt
    - Show the prompt in the prompt field for the image generation tab.
- Automate image generation based on plot ideas ***optional**
- Automatically generate new scene cards (containing plot description and generated image) – could display 3 to the user to choose from for story progression ***optional**

## Project details page * optional

- User can edit the details (i.e. title, plot) so that the LLM prompt will be updated with new information about the story
- Update info in local storage
- Point of View (first person, third person, etc.) **Optional**
- Writing style (describe style and/or include a short extract from your work to have the LLM describe it for you) **optional - could help with the way plot ideas are phrased**
- Sources of inspiration - list books, films, tv shows **optional**
- Target reader?

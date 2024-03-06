# Takeaways from prompting in chat gpt interface

## Request GPT for prompts of other images I could generate for a characters
**Example**
> Here is a prompt that I want to use to generate images with Dall E: Illustrate a serene scene where Sanjana enjoys a quiet moment in a cozy café, lost in thought as she gazes out of the window. Her tote bag rests beside her, now joined by a sketchbook and a cup of chai. The ambient light casts a soft glow on her face, highlighting her contemplative expression.”

> Edit the prompt to add the following details about Sanjana:
> She is a 21 year old Indian girl
> She has dark brown wavy hair
> She wears gold rings and bracelets. 

> Suggest some prompts for other images I could generate of this character.

**Result**

To continue exploring the character of Sanjana in various scenarios and settings, you can craft prompts that highlight different aspects of her personality, interests, and life moments. Here are several suggestions that could inspire diverse and engaging images:

1. **Sanjana's Quiet Moment in a Café**: "Illustrate a serene, anime-style watercolor scene where Sanjana enjoys a quiet moment in a cozy café, lost in thought as she gazes out of the window. Her tote bag rests beside her, now joined by a sketchbook and a cup of chai. The ambient light casts a soft glow on her face, highlighting her contemplative expression."
2. **Adventure in the City**: "Create a dynamic, anime-inspired watercolor illustration of Sanjana navigating the bustling streets of a vibrant city with her tote bag. She's wearing her signature red flannel shirt, with a city map in one hand and a digital camera hanging around her neck, capturing the essence of urban exploration."
3. **A Rainy Day Reverie**: "Generate an atmospheric, anime-style watercolor portrait of Sanjana standing under a canopy of trees on a rainy day. She's holding an ornate, vintage umbrella, her face alight with joy as she watches the raindrops dance around her. The scene is infused with a sense of peace and the beauty of nature."
4. **Festival of Lights**: "Depict Sanjana in a festive, anime-inspired watercolor scene during a Diwali celebration. She is adorned in traditional Indian attire, with her dark brown hair styled in an elegant updo, accentuated by delicate gold jewelry. She holds a sparkler in her hand, her face illuminated by the gentle firelight, surrounded by vibrant rangoli designs on the ground."
5. **Creative Workspace**: "Visualize Sanjana in her creative sanctuary, an anime-style watercolor portrayal of her sitting at a cluttered desk, engrossed in her art. Around her are scattered paints, brushes, and canvases, with the early morning light streaming in through a nearby window, suggesting a dawn of inspiration."
6. **A Journey Through Nature**: "Craft an image of Sanjana on a hiking adventure, captured in an anime-style watercolor. Dressed in comfortable hiking gear and her tote bag replaced with a backpack, she stands at the edge of a cliff, overlooking a breathtaking view of mountains and forests, embodying the spirit of adventure and discovery."

These prompts are designed to showcase Sanjana in a variety of settings and moods, from introspective moments to festive celebrations, allowing for a rich exploration of her character through imaginative and visually compelling imagery.

## Takeaways from prompting for a single character across multiple settings
- Referencing generation ID of previous image or using same seed number for all images results in more consisteng images. Make sure prompts use a similar or identical description of the character as well. Specifying that it's the "same girl from the previous image" also helps. 
- She is often facing the viewer though so it looks a bit like model shots. The setting or backdrop isn’t always very detailed or she isn’t necessarily interacting with the setting in a way that looks natural.
- Sometimes I couldn't use a previous image as a reference - chat GPT would just tell me it's not possible at all. 

## Takeaways from prompting for multiple character across multiple settings
- Generating images with 3 characters (sanjana, akash, and roshan) actually took a few minutes longer than doing it for 1 or 2 characters. The  prompt-image accuracy was much worse compared to the 2 or 1 character scene images. The quality is lower. It’s also hard to reliably get images where all 3 characters are visible.
- Technically characters are recognizable when the original generated images of the characters are referenced and the model is instructed to base the characters’ appearances on those images.
- There are minor issues with rendering faces and getting characters to pose more candidly/naturally.
 
## Some ideas for features to implement based on these exercises
- I can add a feature in the interface that will request the LLM to create a prompt that also suggests more details for the setting so that the image is more like a scene from a story. _Should also tell the user to specify what the character is doing and/or whether it is a candid shot, otherwise it is more likely that she will be looking ‘straight at the camera’ so to speak which results in a less ‘natural’ image._
- Telling the LLM to emphasise certain things if it’s missing from the image can help generate better images ⇒ I could attempt to anticipate this in my application by designing the prompts to the LLM so that they emphasise things that Dall E tends to forget or overlook unless the prompt is worded in a particular way.

## Prompt design strategies that work
- First generate an image that you like and then ask GPT to adapt the prompt to generate a new image of the character in a different setting while ensuring her appearance remains consistent. Use the edited prompt from GPT for Dall E.
- Naming the character and reusing the name across multiple prompts helps.
- Choosing a consistent style might help with consistent character generation as well - i.e. artist or illustrator to emulate, comic book vs fantasy, etc.
- Character details to try including:  “emotion”, “gender”, “age”, “ethnicity”, “height”, eye color, hair color and style, accessories, face shape, skin color
- Specifying the angle of the photo - wide angle, full body, portrait *these are all photography terms
- Specify if you want character to look towards viewer or look away / do some action (candid shot)


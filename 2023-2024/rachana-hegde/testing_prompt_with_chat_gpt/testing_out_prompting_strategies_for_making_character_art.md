Note: All of this was done in the chat GPT interface. 

# Successful prompting attempt #1 
**Prompt for Dall E 3**
Create an image using the request without modifications. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:

"Create a high resolution detailed photo-realistic image of Sanjana,  21-year-old Indian girl, characterized by her dark brown wavy hair and deep dark brown eyes, embodying tranquility and introspection. Sanjana should appear lost in thought, her contemplative expression illuminated by a soft glow that highlights her features. She's dressed casually yet stylishly in a vibrant red flannel long sleeve shirt paired with classic denim jeans, embodying a youthful, carefree spirit.  She always carries a tote bag, signifying her preparedness for any adventure or moment of inspiration, accompanied by personal items like a sketchbook and a cup of chai in settings where appropriate. Sanjana's style includes delicate gold rings and intricate bracelets, symbolizing her elegance and cultural heritage."
**Result **

![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/1071004f-2478-4356-afeb-ee2b3370e6eb)

**Prompting GPT-4 to get a different image prompt for Dall E 3**
Adapt my existing prompt to generate a new image of Sanjana in a bookstore while ensuring her appearance remains consistent: "Create a high resolution detailed photo-realistic image of Sanjana,  21-year-old Indian girl, characterized by her dark brown wavy hair and deep dark brown eyes, embodying tranquility and introspection. Sanjana should appear lost in thought, her contemplative expression illuminated by a soft glow that highlights her features. She's dressed casually yet stylishly in a vibrant red flannel long sleeve shirt paired with classic denim jeans, embodying a youthful, carefree spirit.  She always carries a tote bag, signifying her preparedness for any adventure or moment of inspiration, accompanied by personal items like a sketchbook and a cup of chai in settings where appropriate. Sanjana's style includes delicate gold rings and intricate bracelets, symbolizing her elegance and cultural heritage."

**GPT Response**: 

To adapt your existing prompt for a new image of Sanjana in a bookstore, while maintaining her appearance and the essence of her character, you could use the following: "Generate a high-resolution, detailed, photo-realistic image of Sanjana, a 21-year-old Indian girl, known for her dark brown wavy hair and deep dark brown eyes, as she explores the quiet, inviting aisles of a bookstore. Her presence should emanate tranquility and introspection, with her contemplative expression caught in the soft, ambient light of the store, accentuating her features. Dressed in her signature vibrant red flannel long sleeve shirt and classic denim jeans, Sanjana's youthful and carefree spirit shines through. Her indispensable tote bag is over her shoulder, hinting at her readiness for new discoveries, now possibly filled with newly found books instead of her usual sketchbook and cup of chai. Her delicate gold rings and intricate bracelets remain a constant, adding a touch of elegance and a nod to her cultural heritage. This scene captures a moment of Sanjana's day as she stands holding a book, lost in its summary, the embodiment of a serene seeker amidst the literary world."

**Prompt for Dall E **
> Create an image using the request without modifications. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Generate a high-resolution, detailed, photo-realistic image of Sanjana, a 21-year-old Indian girl, known for her dark brown wavy hair and deep dark brown eyes, as she explores the quiet, inviting aisles of a bookstore. Her presence should emanate tranquility and introspection, with her contemplative expression caught in the soft, ambient light of the store, accentuating her features. Dressed in her signature vibrant red flannel long sleeve shirt and classic denim jeans, Sanjana's youthful and carefree spirit shines through. Her indispensable tote bag is over her shoulder, hinting at her readiness for new discoveries, now possibly filled with newly found books instead of her usual sketchbook and cup of chai. Her delicate gold rings and intricate bracelets remain a constant, adding a touch of elegance and a nod to her cultural heritage. This scene captures a moment of Sanjana's day as she stands holding a book, lost in its summary, the embodiment of a serene seeker amidst the literary world."
> 
> Use seed number 705791951

**Result**

![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/d04ffeb5-0f0d-48c2-8f97-d4d1a30fc30c)

**Prompt for Dall E**
> Create an image using the request without modifications. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high-resolution, detailed, photo-realistic image of Sanjana, a 21-year-old Indian girl with dark brown wavy hair and deep dark brown eyes, capturing a moment of serenity and introspection in the rain. Standing outside, she holds an ornate umbrella above her head, shielding herself from the gentle rainfall. Her contemplative expression, a blend of tranquility and introspection, is softly illuminated by the diffused light reflecting off the wet surroundings. Sanjana is dressed in her distinctive vibrant red flannel long sleeve shirt and classic denim jeans, which speak to her youthful, carefree spirit, even amidst the rain. Though her usual tote bag, a symbol of her readiness for adventure, hangs by her side, it now seems to carry an air of resilience against the weather. The delicate gold rings and intricate bracelets she wears remain visible, gleaming subtly under the rain's touch, symbolizing her unwavering elegance and connection to her cultural heritage. This image seeks to capture Sanjana in a moment of quiet reflection, standing alone with her thoughts as the rain falls around her, embodying a peaceful interlude in her day."
> 
> Use seed number 705791951

**Result**

![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/5eb533e5-b9c3-453b-99ba-cbc20fbb9d09)

# Prompting attempt #2 - using generation_id instead of seed to get consistent images in the chat gpt interface

**Note:** I’m not sure whether I can set the seed OR ask the API to use the same seed. I’m not sure if I can ask the API to reference a previous image’s generation ID to base the new image on. There is no information about seeds or gen_id in Dall E 3 documentation.

**Prompt for Dall E**
> Create an image using the request without modifications. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
>"Create a high resolution detailed photo-realistic image of Sanjana,  21-year-old Indian girl, characterized by her dark brown wavy hair and deep dark brown eyes, embodying tranquility and introspection. Sanjana should appear lost in thought, her contemplative expression illuminated by a soft glow that highlights her features. She's dressed casually yet stylishly in a vibrant red flannel long sleeve shirt paired with classic denim jeans, embodying a youthful, carefree spirit.  She always carries a tote bag, signifying her preparedness for any adventure or moment of inspiration, accompanied by personal items like a sketchbook and a cup of chai in settings where appropriate. Sanjana's style includes delicate gold rings and intricate bracelets, symbolizing her elegance and cultural heritage." 

**Result**
![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/a0d5d66f-c76b-4be3-b6bb-32029f855ba6)


**Prompt for Dall E**
> Create an image using the request without modifications and base this image on a previously generated image with the generation ID number RgFlI37UG2fyRqL3. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high-resolution, detailed, photo-realistic image depicting Sanjana, a 21-year-old Indian girl with dark brown wavy hair and deep dark brown eyes, in a moment of peaceful contemplation while sitting in a cozy café. She should appear deeply engrossed in her thoughts, her contemplative expression bathed in the warm, soft glow of the café's ambient lighting, which accentuates her serene demeanor. Sanjana is dressed in her distinctive vibrant red flannel long sleeve shirt paired with classic denim jeans, reflecting her youthful and carefree spirit. Positioned beside her, her trusted tote bag suggests she's prepared for wherever inspiration might lead, today filled with a sketchbook and a steaming cup of chai placed on the table in front of her, adding to the café's tranquil atmosphere. Her delicate gold rings and intricate bracelets, symbols of her elegance and rich cultural heritage, catch the light, adding a subtle sparkle to her relaxed pose. This scene captures Sanjana enjoying a quiet moment to herself, embodying tranquility and introspection amidst the café's inviting ambiance."

**Result**
![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/aa5abcb9-d18a-41ce-92ad-166526469462)


**Prompt for Dall E**
Create an image using the request without modifications and base this image on a previously generated image with the generation ID number RgFlI37UG2fyRqL3. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
"Create a high-resolution, detailed, photo-realistic image capturing Sanjana, a 21-year-old Indian girl with dark brown wavy hair and deep dark brown eyes, in a tranquil moment of discovery within a lush forest. Her gaze, imbued with tranquility and introspection, settles on a cluster of wildflowers, a soft glow from the dappled sunlight filtering through the canopy highlighting her features. Dressed in her signature vibrant red flannel long sleeve shirt and classic denim jeans, Sanjana's youthful, carefree spirit is evident even in this serene, natural setting. Her indispensable tote bag, a constant companion hinting at her love for adventure and creativity, rests by her side, perhaps now carrying a guide to the flora and fauna of the forest instead of her usual sketchbook and cup of chai. The delicate gold rings and intricate bracelets she wears add a touch of elegance and a connection to her cultural heritage, blending seamlessly with the natural beauty surrounding her. This scene seeks to capture a moment of Sanjana's day as she stands in awe, lost in the beauty of the forest and the simple pleasure of observing flowers, embodying a peaceful harmony with nature."

**Result**
![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/328f525c-7a7f-470d-a4e0-4cf98358d830)

**Prompt for Dall E**
> Create an image using the request without modifications and base this image on a previously generated image with the generation ID number RgFlI37UG2fyRqL3. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high-resolution, detailed, photo-realistic full body image of Sanjana, a 21-year-old Indian girl with her signature dark brown wavy hair and deep dark brown eyes, full of tranquility and introspection, as she wanders through the bustling ambiance of a vibrant market. Her contemplative expression, a blend of curiosity and wonder, catches the soft, natural light that filters through the colorful market stalls, highlighting her features. In this scene, Sanjana has traded her usual casual attire for a bright pink dress that sways with her movements, embodying her youthful, carefree spirit and adding a pop of color to her surroundings. The full-body view reveals her gracefully navigating the market, her tote bag now slung over her shoulder, hinting at the possibility of discovering new treasures among the myriad of stalls. Her style remains consistent with delicate gold rings and intricate bracelets adorning her hands, symbolizing her elegance and cultural heritage even as she immerses herself in the lively market atmosphere. This image captures a moment of Sanjana's day as she stands out in the vivid setting, her gaze roaming, embodying a serene explorer amidst the chaos and beauty of local life."

**Result**
![Image](https://github.com/Vis4Sense/student-projects/assets/66835338/d64461da-421d-41db-b8be-b4f02d99bc70)

**Note**: I'm sure why the image is rendered with the wrong angle sometimes! It seems like another quirk of the image model. 

# prompting attempt #3 - goal is to generate more complex scenes from my novel with the same main character (sanjana) across multiple images

**Prompt for Dall E**
> Create an image using the request without modifications. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high resolution detailed photo-realistic image of Sanjana,  21-year-old Indian girl, characterized by her dark brown wavy hair and deep dark brown eyes, embodying tranquility and introspection. Sanjana should appear lost in thought, her contemplative expression illuminated by a soft glow that highlights her features. She's dressed casually yet stylishly in a vibrant red flannel long sleeve shirt paired with classic denim jeans, embodying a youthful, carefree spirit.  She always carries a tote bag, signifying her preparedness for any adventure or moment of inspiration, accompanied by personal items like a sketchbook and a cup of chai in settings where appropriate. Sanjana's style includes delicate gold rings and intricate bracelets, symbolizing her elegance and cultural heritage."

**Result**
<img width="428" alt="Screenshot 2024-03-05 at 12 15 25 PM" src="https://github.com/Vis4Sense/student-projects/assets/66835338/60cbcc3c-1bd7-446f-80d4-525d699be888">

**Prompt for GPT**
> Adapt my existing prompt to generate a new image of Sanjana standing inside a magic shop looking at bottles of potions. Include these details about the interior of the magic shop: a bell at the entrance, suggesting a recent customer entry, shelves along the far wall, filled with bottles of herbs and a step ladder for access, an antique mirror reflecting light, positioned above a typewriter with a visible sheet of paper, various wooden stools and cushioned chairs randomly placed around the room, low tables with thick books and weathered cabinets filled with more books, wall sconces with jeweled glass lanterns emitting a bright light, a cozy, lived-in atmosphere with a couch suitable for reading and napping, and a fireplace with an amber bottle amidst the coals, appearing to be consumed by the fire. Sanjana is wearing a black dress with her full body visible. Make sure that she is wearing a black dress but ensure her appearance remains consistent:
> 
> "Create a high resolution detailed photo-realistic image of Sanjana,  21-year-old Indian girl, characterized by her dark brown wavy hair and deep dark brown eyes, embodying tranquility and introspection. Sanjana should appear lost in thought, her contemplative expression illuminated by a soft glow that highlights her features. She's dressed casually yet stylishly in a vibrant red flannel long sleeve shirt paired with classic denim jeans, embodying a youthful, carefree spirit.  She always carries a tote bag, signifying her preparedness for any adventure or moment of inspiration, accompanied by personal items like a sketchbook and a cup of chai in settings where appropriate. Sanjana's style includes delicate gold rings and intricate bracelets, symbolizing her elegance and cultural heritage."

***I used GPT’s response as the prompt for Dall E below. *Note the first paragraph that begins with “Create an image using the request…” does not come from GPT-4, that is a paragraph that I explicitly add before the image prompt to help with consistency of character generation.**

**Prompt for Dall E**
Create an image using the request without modifications and base this image on a previously generated image with the generation ID number kAbeT0yKB5JB78jj. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:

"Create a high-resolution, detailed, photo-realistic image of Sanjana, a 21-year-old Indian girl known for her tranquil and introspective nature, now exploring the curious and enchanting interior of a magic shop. Her dark brown wavy hair and deep dark brown eyes reflect the marvel and mystery of her surroundings. Sanjana stands in awe, her contemplative expression softly lit by the ambient glow of jeweled glass lanterns hanging from wall sconces, as she examines bottles of potions lining the shelves.

She is dressed elegantly in a simple yet chic black dress that contrasts with the shop's whimsical chaos, her figure fully visible among the assortment of magical artifacts. The bell at the entrance tinkles, hinting at the recent arrival of another customer, while shelves crammed with bottles of herbs and a step ladder for access fill the far wall. An antique mirror above a typewriter reflects the light, adding a shimmer to the room and to Sanjana's gold rings and intricate bracelets, which sparkle with a touch of her personal elegance and cultural heritage.

The magic shop itself is a trove of wonders, with wooden stools and cushioned chairs scattered around, low tables laden with thick, ancient books, and weathered cabinets bursting with more literature. The room is anchored by a cozy couch, inviting for reading or napping, near a fireplace where an amber bottle sits amongst the coals, creating an aura of mystery as if being consumed by the fire.

This scene captures a moment of Sanjana's day as she delves into the world of magic, embodying a serene explorer amidst the shop's lived-in atmosphere, filled with the promise of adventure and discovery."

**Result**
<img width="431" alt="Screenshot 2024-03-05 at 12 16 31 PM" src="https://github.com/Vis4Sense/student-projects/assets/66835338/0b3c4ca4-b635-4d67-bb60-781169b5785c">

**Prompt for Dall E**
> Create an image using the request without modifications and base this image on a previously generated image with the generation ID number kAbeT0yKB5JB78jj. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high-resolution, detailed, photo-realistic wide-angle image that captures Sanjana, a 21-year-old Indian girl with dark brown wavy hair and deep dark brown eyes, in a moment of solemn reflection at her mother's grave within a sprawling cemetery. The image should emphasize the serene yet somber ambiance of the cemetery, showcasing Sanjana standing full-bodied, her gaze directed downwards towards the earth of the grave, encapsulated by the broader context of her surroundings.
> 
> She is dressed appropriately for her visit, in blue jeans and a tank top, embodying a mix of personal resilience and the rawness of her grief. The moonlight bathes the scene in a soft glow, illuminating not just Sanjana’s contemplative expression but also the intricate details of the cemetery around her—twisted gnarled trees, a ground covered in a light mist, and the full moon commanding the sky above, casting shadows and adding depth to the scene.
> 
> The details of the cemetery, including the eerie beauty of the twisted trees, the ethereal mist at ground level, and the celestial brightness of the full moon, should be visible in the background, adding layers of meaning and emotion to the image. Sanjana’s usual accessories, delicate gold rings, and intricate bracelets are visible, tying her appearance back to her cultural heritage and personal history.
> 
> This wide-angle view should not only focus on Sanjana and her moment of mourning but also on the atmospheric details of the cemetery, creating a narrative that speaks to the connection between the individual and the environment, the personal and the universal aspects of grief and remembrance."

**Result**
<img width="614" alt="Screenshot 2024-03-05 at 12 17 20 PM" src="https://github.com/Vis4Sense/student-projects/assets/66835338/66f9f13f-5045-4566-9b2f-dee0b984feac">

**Prompt for Dall E**
> Create an image using the request without modifications and base this image on a previously generated image with the generation ID number kAbeT0yKB5JB78jj. Maintaining the appearance of the woman in the previous image that I have referenced. After generating the image, tell me what seed number was used for the image and the styles used for the image, and the generation ID number:
> 
> 
> "Create a high-resolution, detailed, photo-realistic image capturing a pivotal moment as Sanjana, a 21-year-old Indian girl known for her serene and introspective presence, stands in a forest clearing, engaging in an extraordinary act. With her dark brown wavy hair cascading over her shoulders and her deep dark brown eyes reflecting a mix of determination and wonder, she is about to open a portal to another realm. The ambient forest light creates a soft glow around her, highlighting her focused expression and the dynamic energy emanating from her hands.
> 
> Dressed in her casual yet defining style, Sanjana wears blue jeans and a tank top, showcasing her readiness for adventure and her youthful, carefree spirit. Her figure is fully visible, standing confidently with the portal beginning to swirl in front of her, a convergence of light and shadow that hints at the unknown world beyond. Despite the change in her activity, her personal style remains unmistakable with delicate gold rings and intricate bracelets adorning her hands, grounding her elegance and cultural heritage even in this moment of magical endeavor.
> 
> This scene captures not just Sanjana's physical journey but also her internal one, as she bridges realms, embodying the essence of exploration and the boundless potential of imagination. The forest around her, alive with the mystery and the promise of adventure, sets the stage for this momentous act, with the portal itself a mesmerizing blend of colors and energies that draw the eye and beckon to the wonders that lie beyond."

**Result**

<img width="494" alt="Screenshot 2024-03-05 at 12 18 00 PM" src="https://github.com/Vis4Sense/student-projects/assets/66835338/b0e276c7-ddad-4e21-b0c8-0294f52ccd0e">

## some takeaways from prompting for single character across multiple settings
- It is possible to get a single character in multiple scenes if I design the prompts carefully and she will be recognisable. There might be slight discrepancies in her facial structure or skin tone but it might not be possible to ‘fix’ this with just prompting.
    - She is often facing the viewer though so it looks a bit like model shots. The setting or backdrop isn’t always very detailed or she isn’t necessarily interacting with the setting in a way that looks natural.

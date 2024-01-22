# Solutions from research paper readings (jan 2024) for addressing image generation model limitations

## Zero-shot Generation of Coherent Storybook from Plain Text Story using Diffusion Models

- They have some strategies for processing the prompts using GPT – like instructing the LLM to add magic words and style modifiers. They also used story text as input for generating prompts.

## Talecrafter: Interactive Story Visualization with Multiple Characters

- Can use a similar structure for my application
- The components of their pipeline are described in the website: https://ailab-cvc.github.io/TaleCrafter/

## Multi-Concept Customization of Text-to-Image Diffusion

- Github: https://github.com/adobe-research/custom-diffusion
- Guide for training model with custom diffusion on Hugging face https://huggingface.co/docs/diffusers/training/custom_diffusion - there are instructions for modifying the script. The only issue is that I can’t find a google colab with things set up like I could for Dreambooth but I can figure out how to run it myself with a bit of time.
- This could be a better option than using Dreambooth since I want to represent multiple characters in an image to explore character interactions in a scene.
- From the research paper: “restricting the weight update to cross-attention key and value parameters leads to significantly better results for composing two concepts compared to methods like DreamBooth, which fine-tune all the weights.”
- From the research paper: “Limitations: difficult compositions, e.g., a pet dog and a pet cat, remain challenging. In this case, the pre- trained model also faces a similar difficulty, and our model inherits these limitations. Additionally, composing increas- ing three or more concepts together is also challenging.”

Note: These papers involve tuning an LLM with RLHF and it isn’t feasible for me to emulate their approach. 

## ****Mini-DALLE3: Interactive Text to Image by Prompting Large Language Models****

Oct 2023

- From abstract: Inspired by the recently released DALLE3 - a T2I model directly built-in ChatGPT that talks human language, we revisit the existing T2I systems endeavoring to align human intent and introduce a new task - interactive text to image (iT2I), where people can interact with LLM for interleaved high-quality image generation/edit/refinement and question answering with stronger images and text correspondences using natural language. **In addressing the iT2I problem, we present a simple approach that augments LLMs for iT2I with prompting techniques and off-the-shelf T2I models. We evaluate our approach for iT2I in a variety of common-used scenarios under different LLMs, e.g., ChatGPT, LLAMA, Baichuan, and InternLM. We demonstrate that our approach could be a convenient and low-cost way to introduce the iT2I ability for any existing LLMs and any text-to-image models without any training while bringing little degradation on LLMs' inherent capabilities in, e.g., question answering and code generation.**

## Optimizing Prompts Using In-Context Few-Shot Learning for Text-to-Image Generative Models

[Publisher: IEEE](https://ieeexplore.ieee.org/document/10378642), Jan 2024

- From Abstract: Thus, this study proposes a prompt optimization method that uses in-context few-shot learning in a pretrained language model. The proposed approach aims to generate optimized text prompts to guide the image synthesis process by leveraging the available contextual information in a few text examples. The results revealed that synthesized images using the proposed prompt optimization method achieved a higher performance, at 18% on average, based on an evaluation metric that measures the similarity between the generated images and prompts for generation. The significance of this research lies in its potential to provide a more efficient and automated approach to obtaining high-quality synthesized images.
- We fine-tuned a large-scale PLM to understand the desired text prompt style and convert naive prompts into an optimized text-prompt style tailored to generative models.

## ****Optimizing Prompts for Text-to-Image Generation****

Dec 2023

- From Abstract - Instead of laborious human engineering, we propose prompt adaptation, a general framework that automatically adapts original user input to model-preferred prompts. Specifically, we first perform supervised fine-tuning with a pretrained language model on a small collection of manually engineered prompts. Then we use reinforcement learning to explore better prompts. We define a reward function that encourages the policy to generate more aesthetically pleasing images while preserving the original user intentions. Experimental results on Stable Diffusion show that our method outperforms manual prompt engineering in terms of both automatic metrics and human preference ratings. Moreover, reinforcement learning further boosts performance, especially on out-of-domain prompts.
- The pretrained checkpoints are available at [this https URL](https://aka.ms/promptist). The demo can be found at [this https URL](https://aka.ms/promptist-demo).

## ****BeautifulPrompt: Towards Automatic Prompt Engineering for Text-to-Image Synthesis****

Nov 2023

- From Abstract: However, current text-to-image models often require multiple passes of prompt engineering by humans in order to produce satisfactory results for real-world applications. We propose BeautifulPrompt, a deep generative model to produce high-quality prompts from very simple raw descriptions, which enables diffusion-based models to generate more beautiful images. I**n our work, we first fine-tuned the BeautifulPrompt model over low-quality and high-quality collecting prompt pairs. Then, to ensure that our generated prompts can generate more beautiful images, we further propose a Reinforcement Learning with Visual AI Feedback technique to fine-tune our model to maximize the reward values of the generated prompts,** where the reward values are calculated based on the PickScore and the Aesthetic Scores. Our results demonstrate that learning from visual AI feedback promises the potential to improve the quality of generated prompts and images significantly. We further showcase the integration of BeautifulPrompt to a cloud-native AI platform to provide better text-to-image generation service in the cloud.

## Tailored Visions: Enhancing Text-to-Image Generation with Personalized Prompt Rewriting

- From Abstract: Despite significant progress in the field, it is still challenging to create personalized visual represen- tations that align closely with the desires and preferences of individual users. This process requires users to articulate their ideas in words that are both comprehensi- ble to the models and accurately capture their vision, posing difficulties for many users. In this paper, we tackle this challenge by leveraging historical user inter- actions with the system to enhance user prompt**s.** We propose a novel approach that involves rewriting user prompts based a new large-scale text-to-image dataset with over 300k prompts from 3115 users. Our rewriting model enhances the ex- pressiveness and alignment of user prompts with their intended visual outputs… Our approach opens up exciting possibilities of applying more search engine tech- niques to build truly personalized large pretrained models.

## ****NeuroPrompts: An Adaptive Framework to Optimize Prompts for Text-to-Image Generation****

November 2023

- From Abstract: In this work, we present NeuroPrompts, an adaptive framework that automatically enhances a user's prompt to improve the quality of generations produced by text-to-image models. Our framework utilizes constrained text decoding with a pre-trained language model that has been adapted to generate prompts similar to those produced by human prompt engineers. This approach enables higher-quality text-to-image generations and provides user control over stylistic features via constraint set specification. We demonstrate the utility of our framework by creating an interactive application for prompt enhancement and image generation using Stable Diffusion.
- ***Note - Code is not available for this***
- **To adapt LMs for prompt engineering, we use a combination of supervised fine-tuning followed by reinforcement learning via the PPO algorithm.**

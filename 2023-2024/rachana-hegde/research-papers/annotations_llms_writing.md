# Notes on Research Papers 
# LLMs for Creative Writing

## Co-Writing Screenplays and Theatre Scripts with Language Models: Evaluation by Industry Professionals

[Link](https://dl.acm.org/doi/abs/10.1145/3544548.3581225) (ACM CHI), April 2023

- From Abstract: By building structural context via **prompt chaining**, Dramatron can generate coherent scripts and screenplays complete with title, characters, story beats, location descriptions, and dialogue. We illustrate Dramatron’s usefulness as an interactive co-creative system with a user study of 15 theatre and film industry professionals. Participants co-wrote theatre scripts and screenplays with Dramatron and engaged in open-ended interviews.
- This is a difficult task for LLMs because the narrative of a script or screenplay must exhibit long-term coherence and reincorporation, and LLMs are limited in their ability to model long-range dependencies (e.g., to reincorpo- rate information from many pages ago). This limitation stems from the context window of LLMs, which today is limited to at most 2048 tokens (i.e. about 1500 words) in state-of-the-art models.
- In this work, we present Dramatron, a system that uses LLMs to generate scripts and screenplays hierarchically through a method we call hierarchical story generation. Dramatron leverages the strengths of LLMs and combines custom prompts (see Appendix E) and prompt chaining [121] with structured generation for long range coherence across the entire script.
- Hierarchical generation of stories can produce an entire script—sometimes tens of thou- sands of words—from a single user-provided summary of the central dramatic conflict, called the log line [107]. From the input log line, Dramatron can generate an entire script with a title, list of charac- ters, a plot (i.e. a list of scene summaries with settings and beats), location descriptions, and dialogue (see Fig. 1). The user can inter- vene at any stage of the hierarchical generation. They can solicit alternative generations, edit and rewrite output text, or continue text generation. In this way, the human interactively co-writes the script. Our methods can be used with state-of-the-art LLMs that accept an input prompt and then predict which tokens come next.
- **This paper’s key contributions are 1) the introduction of Dra- matron: a co-writing tool leveraging novel artificial intelligence- powered large language models, 2) the first study leveraging hier- archical story generation for co-writing scripts and screenplays, where authors can generate multiple responses, edit, and then re- generate at various levels of the story hierarchy, and 3) a detailed evaluation of the human-AI co-creative process with industry pro- fessionals co-writing alongside Dramatron.**
- The implicit hypothesis of our work on Dramatron is that interactive authorship alongside an AI-based writing tool could be useful for writers, similar to the contribution of multiple writers in a writer’s room working collaboratively on a theatre script or screenplay.
- And, unlike Dramatron, none of them used few-shot learning and prompt engineering to prime LLMs for generation.
- LLMs…have difficulty with long-term semantic coher- ence due to the restricted size of their context windows…**the current state-of-the-art method for longer text generation incorporates a human-in-the-loop who selects from various generations sampled from the model…**the model generates choices for the next textual snippet, while the human does the selection.
- …we structure script generation using interdependent narrative el- ements. We base our approach on Aristotle’s Poetics [5], which identified 1) plot (mythos) as the most important part of a tragic story—the other elements being the 2) theme of the story (di- anoia), 3) its characters (ethos), 4) dialogues (lexis), as well as melody and spectacle.
- In order to achieve narrative coherence despite the limited context window of LLMs, we generate a plot synopsis in one go, as a sequence of beats.
- The log line summarizes the story in a few sentences …Log lines typically contain the setting, protagonist, antagonist, a conflict or goal, and sometimes the inciting incident [8]…we use log lines to start the hierarchical story generation process.
- **We hypothesize that if the system can generate an entire script exhibiting reasonable long-term coherence from a single log line without human intervention, then such scripts can serve as drafts for the writer.**
- Our narrative generation is conceptually divided into **three hier- archical layers of abstraction that loosely interpret the narrative elements of Aristotle’s tragedy.** The highest layer is the log line (or theme)…single sentence describing the central dramatic conflict. The middle layer contains character de- scriptions, a plot outline (a sequence of high-level scene descriptions together with corresponding locations), as well as location descriptions. The bottom layer is the actual character dialogue for the text of the script.
- As illustrated on Figure 1, the story is generated top-down [96, 111, 116]. After the human provides the log line, Dramatron generates a list of characters, then a plot, and then descriptions of each location mentioned in the plot. Characters, plot, and location descriptions all meet the specification in the log line, in addition to causal dependencies, enabled by prompt chaining…Finally, for each scene in the plot outline, Dramatron generates dialogue satisfying previously generated scene specifications. Resulting dialogues are appended together to generate the final output.
- Each prompt has a few examples of desirable outputs. These are included in the prefix and adaptation to only a handful of examples is sometimes referred to as few-shot learning. As illustrated in Figure 2, prompts are concatenated with user-supplied inputs and/or outputs of previous LLM generations. This method is called prompt chaining [121], which is a type of algorithmic prompting [24]. At lower levels of the hierarchy (see Fig. 1), prompts are chained together with outputs from higher levels of the hierarchy.
- In this work, we primarily used two sets of prompts: one based on Ancient Greek tragedy Medea by Euripides, and one based on science-fiction films. For Dramatron, each prompt set is composed of: 1) title prompt, 2) character description prompt, 3) plot prompt, 4) location description prompt, 5) and dialogue prompt. For both of these prompt sets, we chose dialogues that were in the public domain. The Medea plot was chosen because it corresponded to the Freytag Pyramid narrative arc, whereas the sci-fi plot followed an alternative narrative structure, the Hero’s Journey.
- We engineered the hierarchical prompt structure and the few-shot examples through iterative prompting and testing.
- At each step, the writer can…
    - Generate a new suggestion (i.e., run the LLM again with the same prompt).
    - Continue generating from the end of the previous generation, similarly to typical “flat” LLM generation.
    - Manually edit some or all of the output generated by the LLM.
- The writer can furthermore perform these operations by stepping forward and back in the Dramatron hierarchy. For example, they could: 1) generate a title, 2) generate a new title, 3) edit the title, 4) generate a list of characters, 5) edit the characters by removing one character and changing the description of another, 6) generate a plot outline, 7) edit the plot by removing part of the narrative arc, 8) generate a continuation of that edited plot, 9) go back and rewrite the log line, etc.
- In this study, **we employed the Chinchilla large language model (LLM) [50], represented as a neural network with 70B-parameters and that was trained on 1.4T tokens of the MassiveText dataset…**We conducted our study using Chinchilla 70B because it outper- formed other LLMs on a large collection of language tasks [50].
- **The code of Dramatron is implemented in Python and the user- facing interface was implemented in a Google Colab with text widgets, allowing interactive editing.**
- During the writing sessions, one interviewer (the operator) was operating the user interface to Dramatron, typing text and making edits suggested by the participant, and explaining the generation process, while another interviewer was asking questions about the interaction and taking notes. The interface to Dramatron was shared via screen.
- As another quantitative evaluation, **we track writer modifications to generated sentences** [91]. This allows for **comparison of Dramatron generations pre- and post-human edits…**Our objective is to **assess whether Dramatron “contributes new ideas to writing”, or “merely expand[s] on [the writer’s] existing ideas**” [62].
- **Participants identified inspiration, world building, and con- tent generation as potential writing applications** for Drama- tron…
- Participants noticed various biases embedded in the language model.
- **Unsurprisingly, participants noticed logical gaps in story- telling, lack of common sense, nuance and subtext, which were manifest in the lack of motivation for the characters**
- All participants found Dramatron **useful for getting inspiration**: “**this is perfect for writers’ block**” (p13), “I can see it being very helpful, if you are stuck” (p4, p5), “more in depth than the writers’ unblocking prompts website” (p3).
- 5.2.2 Generation of Alternative Choices and World Building (script writing)…“If I was going to use this to write a script, I’d use it to generate characters to see if it generated things I hadn’t thought about. Or relationships I hadn’t thought about”
- 5.3.1 **The system outputs are too literal and predictable**. **Some par- ticipants found the character “relationships so tight and prescriptive” (p4, p5); if a character has “a noble endeavour, it will be stated in the dialogue**” (p4, p5)…Similarly, the title generation “does what it says on the tin” (p15)…
- **The system outputs can be problematic, stereotypical, and bi- ased…many participants noticed gender biases and ageism in the system outputs**…“The protagonists are both male characters, and all of the sup- porting characters are female” (p4, p5). “The female lead is defined by their relationship to the other characters…This problem raised the issue of coping strategies or cultural appropriation: “if we gave GPT-2 some character names, it could come up with bigoted characters: [we] went with more made up names, not gender specific, not ethnicity- specific”
- Fundamental Limitations of the Language Model and of Dramatron
    - Lack of consistency and of long-term coherence. “**Keeping dialogue character-based and consistent is most important [...] There is still some difficulty in getting it to stay on track with the context.**” (p15).
    - 5.5.3 **Lack of nuance and subtext…**”A lot of information, a bit too verbalised, there should be more subtext” (p6). “With dialogue in plays, you have to ask yourself two questions: **1) Do people actually speak like that?** 2)…The element in the log line became the central bit in the generation, and that was repetitive”
    - Lack of a motivation for the characters (storytelling). “**The sto- ries do not finish. The character journeys are not complete. There is perhaps something missing in the character background** [...] Where is the emotional motivation, stuff that might exist in the backstory and not exist in the script?” (p14). “On the first go-through, you are looking for the goal of the protagonist, and impediment for that drive. What is my character doing, and what do they want?
- Structural Problems of Dramatron (script writing)
    - **“If I could program something to write a script, I wouldn’t start with a log line. You can also consider starting with a character and an obstacle in the way of that character” (p9).**
    - Negative consequence of Dramatron’s design choice: **parallel dialogue generation (script writing).** “**From the scene beats, it has no idea of what the previous dialogue contained. Then to see the dialogue not be consistent is jarring**” (p1).
- **Suggested Improvements to Dramatron (script writing)**
    - **Modeling characters and their relationships was a recurrent theme: “can we make the system relationship-driven?” (p12), “where does status belong in character building?**” (p12)…Participant 12 suggested: “as an author, I would build a social graph of the characters relations”.
    - Answering the question “**How do you get the system to know where the scene should start and end?”** (p15), three participants (p8, p13, p15) suggested **fitting a narrative arc within each scene**.
    - Several participants wanted to be able to query and dialogue with the writing model: “Have you engaged [the AI system] by trying to give it notes?” (p2) to allow it to learn about the world: **“How does world building happen? Maybe the model needs to know the Ws of Stella Adler [(Who? What? Where? Why? How? etc.)**] Can you get the system to answer these questions?” (p9), or to allow rewriting and reformulation: **“can we ask the system to re-write with a style or context?” (**p8).
- it might be helpful to consider how it might be used within the context of other contemporary writing”— **suggesting alternative narrative structures and elements.**
- Over the course of the interviews, we incorporate the feedback we could by making small, incremental changes to the prompt prefix sets of Dramatron…the feedback from users can be directly incorporated to improve the system for the next interaction.
- Future Work**: First, one enhancement to improve coherence especially suited for screenplays and theatre scripts would be to generate complete char- acter arcs. Second, generating satisfying scene conclusions in the dialogue generation step could be improved by using hierarchical generation for dialogue: construct each scene’s dialogue from a gen- erated beginning, middle, and end dialogue beat. Third, to improve stylistic coherence, future work could explore methods to generate thematic outputs satisfying notions of genre by rejection sampling, as in [68], writing more stylized prompts, or transposing existing ones into a variety of diverse author styles and voices using large language models.**
- **Future work on Dramatron could explore multiple different styles of writing** as was suggested through feedback from experts in the study. Dramatron was originally designed for a single style: top- down hierarchical generation where each subsequent step depends on those that came prior…one participant’s remarks: “**I think the model where writers begin from inputting character and logline favours certain kinds of processes - is there a version of the system that can originate from a different point?”**
- In fact, they argued against Dramatron’s constrained top-down hierarchy: **“Why generate characters first? At earlier parts of the creation process you might not know the characters…**This said, Dramatron does allow for going back-and-forth between levels in the hierarchy, and through creative prompting, **future work could allow for generation steps to happen out of order.**
- Biases and stereotypes. As per the feedback gathered in Sec- tion 5.3, some biases—in particular around gender—were noticed by the participants in the LLM outputs. While this was not the prime focus of the interview sessions, such biases and stereotypes could be systematically explored. **Future work could explore what sorts of narratives can be written using  AI tools and how the system performs for different cultural groups.**
- To mitigate copyright issues, we envision several risk mitigation strategies for writers using co-writing tools. The writer could query short parts of the script using a search engine and/or plagiarism detection tool [61]. In the future, that functionality could be part of the writing tool itself. Further, we believe that such tools require transparency. That is, writers using these tools should be aware of the origin of the data in the LLM, and their audiences should be aware that those outputs were generated through an interaction between humans and co-creative tools.
- Multiple subplots can be com- bined into a single plot, and multiple plots can intertwine to create complex narratives. Many contemporary stories are written to have multiple plot lines which intertwine. But, **there is little work on how to computationally model and generate multiple intersecting plot lines. Complex plot line interaction is a promising avenue of future work** for human-machine co-creativity research in story generation.
- **In “Dia- logueScript: Using Dialogue Agents to Produce a Script”, Schmid- tová et al. [99] use different LLMs for each character.** Si et al. [105] model multi-user dialogue and character relationships for story con- tinuation. Schmitt and Buschek [100] use question-based chatbot interactions to assist with character creation.

## ****More human than human: LLM-generated narratives outperform human-LLM interleaved narratives****

[Link](https://dl.acm.org/doi/10.1145/3591196.3596612) (ACM), June 2023

- [From Abstract] The present paper aims to compare stories generated by an LLM only (non-interleaved) with those generated by interleaving human-generated and LLM-generated text (interleaved). The study’s hypothesis is that interleaved stories would perform better than non-interleaved stories. To verify this hypothesis, we conducted two tests with roughly 500 participants each. Participants were asked to rate stories of each type, including an overall score or preference and four facets—logical soundness, plausibility, understandability, and novelty. Our findings indicate that interleaved stories were in fact less preferred than non-interleaved stories. The result has implications for the design and implementation of our story generators. This study contributes new insights into the potential uses and restrictions of interleaved and non-interleaved systems regarding generating narrative stories, which may help to improve the performance of such story generators.
- Note: They used stories from GPT to test this.

## ****End-to-end Story Plot Generator****

[Link](https://arxiv.org/abs/2310.08796), Oct 2023 (Preprint)

- [Paper summary from Twitter](https://twitter.com/tydsh/status/1720124757084098898): It can generate a complete story plot with 1,000+ tokens, including setting, characters, outlines, in less than 30 seconds, and can be further fine-tuned for different goals. It is based on our previous story generation paper ([https://arxiv.org/abs/2212.10077](https://t.co/Fnj5gl2oqj)), but is much faster and does not require hundreds of OpenAI API calls. Code and data are open sourced.
- Code available here: https://github.com/facebookresearch/doc-storygen-v2
- From Abstract: We study the problem of auto- matic generation of story plots, which includes story premise, character descrip- tions, plot outlines, etc. To generate a single engaging plot, existing plot gen- erators (e.g., DOC (Yang et al., 2022a)) require hundreds to thousands of calls to LLMs (e.g., OpenAI API) in the planning stage of the story plot, which is costly and takes at least several minutes. Moreover, the hard-wired nature of the method makes the pipeline non-differentiable, blocking fast specialization and personalization of the plot generator. In this paper, we propose three models, OpenPlot, E2EPlot and RLPlot, to address these challenges. OpenPlot replaces expensive OpenAI API calls with LLaMA2 (Touvron et al., 2023) calls via careful prompt designs, which leads to inexpensive generation of high-quality training datasets of story plots. We then train an end-to-end story plot genera- tor, E2EPlot, by supervised fine-tuning (SFT) using approximately 13000 story plots generated by OpenPlot. E2EPlot generates story plots of comparable quality to OpenPlot, and is > 10× faster (1k tokens in only 30 seconds on aver- age). Finally, we obtain RLPlot that is further fine-tuned with RLHF on several different reward models for different aspects of story quality, which yields 60.0% winning rate against E2EPlot along the aspect of suspense and surprise.
- To generate high-quality story plot datasets for training the end-to-end model as well as the reward models, we need a hard-wired pipeline to generate story plots by repeatedly prompting LLMs.
- Our pipeline for generating training datasets follows Yang et al. (2022a) while replacing OpenAI API calls with the Llama2 model, which eliminates the rate limit and makes large batch generation feasible.
- Note that although our end-to-end generator is totally automatic without human intervention, it is easy for humans to co-create after the plot generation stage. Since the story plot is relatively short and thus easy for humans to evaluate, one can easily edit the plot to obtain a more desired story.
- ***********Future work -********** For example, **the current generation speed is around 30 seconds, which is still somewhat slow from a user experience perspective.** It might be possible to incorporate techniques for more efficient inference such as Zhang et al. (2023) into our end-to-end model. Also, since the previous DOC pipeline has more flexibility for controlling the level of granularity, it would be appealing to train an end-to-end model that inherits this property. Additionally, a high-quality reward model is important to improve the end-to-end generator.

## ****TaleBrush: Sketching Stories with Generative Pretrained Language Models****

**[Link](https://dl.acm.org/doi/10.1145/3491102.3501819) (ACM CHI), April 2022**

- Abstract: **We introduce TaleBrush, a generative story ideation tool that uses line sketch- ing interactions with a GPT-based language model for control and sensemaking of a protagonist’s fortune in co-created stories**. Our empirical evaluation found **our pipeline reliably controls story gen- eration while maintaining the novelty of generated sentences**. In a user study with 14 participants with diverse writing experiences, we found participants successfully leveraged sketching to iteratively explore and write stories according to their intentions about the character’s fortune while taking inspiration from generated stories.
- TaleBrush is focused on human and AI co-writing short story outlines by allowing writers to control the generation according to the level of fortune the protagonist experiences [34, 121, 142]. Writers can specify the sequence of a character’s fortune with a simple and expressive interaction (Figure 1A3). Using a single stroke (simple), the writer defines the fortune over the entire protagonist’s ‘time-series’ (expressive). The sentences generated by TaleBrush are reflected back to the user as a line drawn on top of the original sketch (Figure 1B2).
- we im- plemented a technical architecture that achieves steerable story generation by training 1) learnable prompts that guide a language model to serve different story generation tasks [87] and 2) a control module that steers the language model to generate stories according to the given sketch [83].
- **To summarize, our work contributes: 1) A line sketching inter- action for control and sensemaking of story generation with an abstract graphical representation of sequential attributes. 2) A GPT- based controllable language model architecture that generates story sentences with the sketching input on the protagonist’s fortune. 3) TaleBrush, a system that enables human-AI story co-creation with the protagonist’s fortune arc by combining line sketching interac- tion with GPT-based controllable language model. 4) Reflections on generalizable design elements of control interaction for iterative human-AI co-creation and how line sketching interaction can be expanded to other generative contexts.**
- TaleBrush is designed to help writers co-create a short storyline with AI through sketching interactions. **TaleBrush supports the planning stage of the writing process [44, 48] by giving ideas that can be novel to writers.** We chose to support this specific stage, as writers would likely accept and benefit from diverging generations. **After a story is generated, writers can freely edit it or even try the generation again to see another story from TaleBrush. TaleBrush can support writers who would use generated sentences as writing prompts, or even potentially help them overcome writer’s block.** For novice writers, TaleBrush would demonstrate a story writing that would allow them to easily jump into writing.
- **The interface for TaleBrush is implemented as a web application, using HTML, CSS, JavaScript, and React. The language model oper- ations for text generation are implemented in a back-end server. A Flask-based REST API is used to connect the front– and back–end sub-systems.**
- As a language model, we used a GPT-Neo [13], which is a GPT-based auto-regressive model [21, 119] with 2.7 billion parameters.
- The benefit is that one large pre-trained LM can be utilized for different tasks just by replacing prompts and contexts according to the task purpose. We trained soft prompts for story continuation and infilling. For continuation (Figure 9a), the previous context and protagonist are fed into the language model as input and the model generates the continuing sentences. We appended the character information as models with- out character information tend to introduce random characters. We placed the character information right before the text to be gener- ated, to make it more likely that character information is considered during the continuing generation.
- In addition to the automated test, **we conducted a human eval- uation to see if stories generated by TaleBrush are perceived as coherent, novel, and controlled.**
- Potential for quick and iterative ideation. **Experts and hobbyists mentioned that they would use TaleBrush to quickly iterate through diverse ideas. Collected ideas can be used in the ideation stage or to overcome writer’s block.** This benefit would be maximized in settings where the writer should bring up multiple stories, such as tabletop role-playing games.
- Addressing bias. Potential bias in the story generation and con- trol was brought up as an issue. For example, P5 perceived that the algorithm generates stories that are more likely written in west- ern culture. P10 mentioned that the controlled generation did not align with what they expected when the protagonist is an anti-hero, signaling potential bias. An important starting point would be in ensuring a more diverse training set, as is broader testing.
- **Alternatively, if a writer wants to convey condensed in- formation about character interaction, diagramming a character network graph can be a control option [4]. For example, one could imagine drawing multiple instances of a network diagram to guide the AI by which characters in a story should interact and how.**

## Social Dynamics of AI Support in Creative Writing

[ACM CHI](https://dl.acm.org/doi/10.1145/3544548.3580782), April 2023

- Abstract: In this work we ask when and why a creative writer might turn to a computer versus a peer or mentor for support. We interview 20 creative writers about their writing practice and their attitudes towards both human and computer support. We discover three elements that govern a writer’s interaction with support actors: 1) what writers desire help with, 2) how writers perceive potential sup- port actors, and 3) the values writers hold.
- In 1981 Flower and Hayes proposed the cognitive process model of writing [10]. Their model, based on empirical research, describes **three main cognitive processes—planning, translating, and reviewing— which are nonlinear and hierarchical**. Planning includes generating ideas, setting goals, and organizing thoughts. Translating is the act of ‘translating’ ideas and thoughts into words on the page. Re- viewing includes evaluating and revising what has been written…writers move between all of them [processes] throughout a writing session, and within a single process may call upon all three as sub-processes.
- Some interviewees had experience with an existing creative writing tool called SudoWrite. SudoWrite is…a story writing tool. It uses a large language model…SudoWrite provides capabilities such as continuing a story where you left off, describing a scene, rewriting according to some guidelines, brainstorming plot points, and feedback.
- Writer Desires for Support.
    - Planning. The kinds of planning spanned from early-stage brainstorming before anything had been written, to how to tie up a poem or some plot points. Some talked about wanting open-ended inspiration, while others wanted help with research or coming up with details.
    - Several writers, both those who used SudoWrite and those who didn’t, **discussed using a computer program to help them with writer’s block.** W14 described a hypothetical situation, “**where I’m not sure how to proceed, but [could use the computer] to see some possibilities laid out.” S16 talked about how “it’s a lot easier to react to something and make modifications than to come up with something from nothing.**” S20 talked about how SudoWrite brought ease to her writing, saying she could “pound her head against the wall” and “open up other books and flip through for inspiration”, but SudoWrite eliminates this struggle for her when she feels stuck.
    - When talking about how they typically sought out support, writers mostly talked about getting feedback on their writing…Almost all discussed the importance of needing other people’s perspectives…
- **writers expected an explanation for feedback, especially if it came from a computer…**W7 similarly wanted to know what the computer was reading for, saying “Maybe if the computer was delineated as reading for technical or imagistic... if I knew what lens it was reading in. Otherwise I’d be like, ‘based off of what?’”
- **Many writers noted that requesting help with their writing was an imposition**. By asking for support, they are asking a friend or acquaintance for time, and were always mindful of such a request…Several writers noted that a computer program wouldn’t have these issues.
- When it came to computers, this idea of sharing the intention was often a roadblock.
- W12 saw this as a benefit of working with a computer, noting that **it’s easier to “stay on track with a creative vision” if the computer doesn’t have a creative vision of its own.**
- **Authenticity. Writers talked about authenticity, or their ‘voice’, as a concern when it came to incorporating the ideas or suggestions of others.**
- **Comparatively, writers were not concerned about maintaining a good relationship with a computer program, and weren’t worried about judged.** Com- puters may best serve writers in tasks that feel too mundane, too frequent, or too worrisome to turn to a peer or mentor…**many writers were interested in programs that could suggest potential endings, point out possible problems, or provide new ideas.**
- **Design Guidelines**
    - **System designers should consider directing writers’ assumptions about the system by providing context, such that writers are more likely to understand system capabilities correctly. This context could be in the form of suggesting a mental model to the writer. A number of caricatures or models of AI writing have been proposed, like thinking of the AI as a ‘deranged but very well-read parrot’ [35] or considering computer-generated text as a kind of automatic writing [27]…context could also come from giving examples of what a system is and isn’t good at or interface design decisions (e.g. where computer-generated text is situated in relation to where the writing occurs).**
    - **Intention—what a writing is trying to achieve in their work or why they are pursuing a project—dictates how writers make choices about incorporating suggestions or feedback.** As a simple example, if someone critiques a sentence as being cliché, but the writer intended to employ cliché, the critique isn’t helpful. Inten- tion may be incorporated into system design in a variety of ways. **At a high level, systems could explicitly ask writers to articulate their goals, and attempt to use this articulation to direct writers to particular features or customize system outputs. At a more low level, systems could add ‘intention’ context to outputs. For instance if a system provides three sentence completion suggestions, and two are visually descriptive and the third includes character ac- tion, these suggestions could be colored according to their intent (namely, adding visual description and furthering the action).**
    - Authenticity is often related ownership, and **research has found that ownership over a final output decreases with the amount of text the system, versus the writer, produced [22].** However, our interviews suggested a more nuanced view of authenticity that is not necessary directly correlated with ownership or levels of contribution. For instance, writers worried about reader percep- tion of authenticity, suggesting that **a system that can accurately mimic a writer’s unique style may not create authenticity concerns.** Similarly, writers discussed how having an extensive relationship with someone meant that that person’s contributions felt more authentic; **systems that customize to a writer over time may also result in contributions that feel more like they came from the writer (as the writer contributed, implicitly or explicitly, to customizing the system) versus a generic program.**
- **Novel Kinds of AI Writing Support**
    - most writing support tools studied in HCI generate text for a writer to use in their writing project, rather than support the reviewing process in some way…**Writers said the most helpful feedback was specific and they could ask questions about it.**
    - However, **we see a future where computers can help writers articulate or understand their own intention.** While intention may not always be found in what has already been written, **computers may be able to guess at the intention based what has been provided**, and provide a mirror for the work that the writer may find useful. But **little work today explicitly models a writer’s intention, or attempts to evaluate how well a system was able to understand or align itself with an intention.**
- Conclusion - In this work we addressed the gap between the nuanced support writers get from peers and mentors, and the more rigid and simple support writers can get from computers. We interviewed 20 creative writers from a variety of genres, including 6 writers currently using an AI writing support tool. Through a qualitative analysis, we report on three high-level categories that modulate how writers decide when and why to look for support: 1) what writers desire help with, 2) how writers perceive potential support actors, and 3) the values writers hold about the writing process. This taxonomy illuminates the social dynamics that govern writers’ collaboration with outside entities, and has implications for future system design.

## Wordcraft: Story Writing With Large Language Models

[Link](https://dl.acm.org/doi/abs/10.1145/3490099.3511105) (ACM), March 2022

- **************My paraphrased summary -************** Wordcraft employed a Language Model (LLM) in conjunction with an editor and an interface that prompted users to extend the narrative, propose rewrites, and request additional details. Wordcraft was used for tasks such as generating ideas, rewriting scenes and copyediting.

# Storyboarding (with AI)

## ****Interactive Storyboarding for Rapid Visual Story Generation****

[Link](https://ieeexplore.ieee.org/abstract/document/9954679) (IEEE), October 2022

- From Abstract - We implement a prototype system, Gennie, that can interact with users and suggest AI-generated sketches for each scene of the storyboard.
- The storyboard is a sequence of drawings, typically with some directions and dialogue, that represents the shots planned for story products.
- **Given the text descriptions specified by the users, Gennie represents multiple draft sketches that match the story, and the users can get some inspiration or utilize the sketches for their story.** Since **draft sketches offered by Gennie have the flexibility and lack detail,** users can utilize the sketches as blueprints for their sake as sources for the composition of objects or the final look of visual scenes.
- Drawing a storyboard is crucial to planning any form of visual narrative. The composition of the objects in the frame and the point of view created by the angle can significantly enhance or alter how the viewer understands the story. The AI agent Gennie is developed in this regard to help extend the limits of an individual’s imagination.
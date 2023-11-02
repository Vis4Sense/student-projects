# RL training platforms

While Replicate is a good solution for publishing and using LLMs for sentiment analyisis purposes (as described [here](llm_cost_research.md)), it does not seem to provide any real training functionality for other types of models such as Reinforcement Learning models, which might become crucial to the project.

For creating Reinforcement Learning models the following options were found:

- Training on own PC
  - This might be a good solution if the scope of the model is not too big and the training is not to resource intensive
  - Drawback of this is that training might take a long time and if it is resource intensive it might make the computer hard to use
    - Still a good choice if the model is small and not a lot of re-training needs to be performed
- Training on specialized platforms
  - Examples include Vertex AI by Google and Amazon SageMaker
    - They provide Notebook instances and libraries that make training fairly easy
    - Pay for what you use cost model
      - Pay per minute of usage
    - Can be complex to use

Given that the size of the model to train is not yet defined it would be fairly hard to produce any cost estimate for the usage of the specialized platforms. For the purpose of this project the best approach is to try to perform training on personal PC and see what is the required time and resources for that (if it is doable). Based on those results decide whether to start using specialized platforms for training RL models.
import openai

# export your OpenAI API key here
openai.api_key = 'sk-proj-EnUAQnTOEWDbiLWpOnDaT3BlbkFJQnbeMfij4F9CmjTtkmlB'

# check the available models
models = openai.Model.list()
for model in models.data:
    print(model.id)
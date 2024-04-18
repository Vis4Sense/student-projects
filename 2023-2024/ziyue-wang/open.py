import openai

# set the OpenAI API key here
openai.api_key = 'sk-proj-EnUAQnTOEWDbiLWpOnDaT3BlbkFJQnbeMfij4F9CmjTtkmlB'

def request_completion(prompt):
    try:
        # use gpt-3.5-turbo model to search
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response['choices'][0]['message']['content'].strip()
    except openai.error.RateLimitError:
        return "Rate limit exceeded. Please try again later."
    except openai.error.APIError as e:
        return f"API returned an error: {str(e)}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"

# sample usecase
prompt = "Explain the concept of recursion in programming."
result = request_completion(prompt)
print(result)

# this python file is written to figure out why my original API tokens are always out of budget???
# finally I charge on my GPT wallet and then I get it worked...
# this program is useful for testing whether an API is available or not
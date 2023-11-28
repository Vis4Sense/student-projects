# Code taken from here: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

import requests
import io
from PIL import Image

# Note: Don't share this!
TOKEN = ""

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {TOKEN}"}


def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content


image_bytes = query({
    "inputs": "tall grey skinned strong muscular brunette medieval woman, fantasy painting",
})

# Sometimes this code returns an error and other times it works
image = Image.open(io.BytesIO(image_bytes))
image.show()  # Open image in your OS default image viewer

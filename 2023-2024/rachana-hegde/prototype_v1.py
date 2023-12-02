from flask import Flask, render_template, request, redirect, url_for
from diffusers import AutoPipelineForText2Image, StableDiffusionPipeline, DiffusionPipeline

# Note: Don't share this!
TOKEN = ""

app = Flask(__name__)


# Display image generation page
@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")


# Code for running SD on macbook pro: https://huggingface.co/docs/diffusers/optimization/mps
# This actually works! But the model keeps getting loaded each time I run the code (and this slows things down) - need to address

pipe = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
pipe = pipe.to("mps")

# Recommended if your computer has < 64 GB of RAM
pipe.enable_attention_slicing()

prompt = "beautiful landscape scenery glass bottle with a galaxy inside cute fennec fox snow HDR sunset"
image = pipe(prompt).images[0]
image.show() # Open image in your OS default image viewer

# TODO Load the model once and create a loop to go through different prompts

# prompt taken from https://stable-diffusion-art.com/sdxl-turbo/
# image_bytes = query({
#     "inputs": "beautiful landscape scenery glass bottle with a galaxy inside cute fennec fox snow HDR sunset",
# })


if __name__ == "__main__":
    app.run(debug=True)

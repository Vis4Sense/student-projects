# Article Reading Notes
Prompt-Magician: Interactive Prompt Engineering for Text-to-Image Creation


## Background
As large text-to-image models need refined prompt to get desired image. This needs user to carefully create natural language prompts and refine them for many iterations, which can be time-consuming and if failed, can be really confusing. There is a need for people to make the process of "prompt engineering" simpler, more clearly visualized and less ambiguous (confusing).

This article proposed a visual analysis system for prompt engineering called __Prompt Magician (PM)__.  PM, as a prompt-improving assistant, can __provide a summary of images__ both generated and retrieved (from the Diffusion DB), __cluster the images by image-evaluation criteria__ specified by user, and do __key-word recommendations__ with priority (these keywords all come from corresponding prompts of images retrieved in DiffusionDB). 


## What Can PM Do?
- Use user prompt and a range of hyperparameters (instead single parameter in traditional Diffusion), generate a set of images including both "requested images" and "similar images", under each value of the hyperparameter.
- Provide clear visual summary for results obtained above.
- Effective image evaluation from multiple aspects and provide an overview.
- For "similar images", provide keyword recommendations alone with images.


## Workflow
__Step 1 -__ receive user input (prompt and scope)  
__Step 2 -__ generate images (Stable Diffusion) & __retrieve image with prompt recommendation__   
__Step 3 -__ embed above to user interface including evaluation


## Prompt Recommendation
Prompt recommendation model: "mines special and relevant prompt keywords from similar image creations.". The procedure includes:

 1. retrieve user-prompt-similar image from Diffusion DB
 2. embed images with semantic features
 3. cluster images with hierachy
 4. identify important or special keywords from prompts of each image-cluster
 5. match each prompt keyword with its most related image cluster


### Image Retrieval
When retrieveing (searching) similar images from Diffusion DB, use __image features__ instead of __image + prompt__ as search space. Use __CLIP Model__ for aligning prompt to image space.

Both prompt (text) and images will be transformed to feature vectors, and CLIP will align these feature vectors into pairs. 

### Image Embedding
Embed images and text both into one feature vector to discover semantic similarities between images, and aggregate prompt semantically-similar images. Also use __t-SNE algorithm__ to enable user exploration of similar images.

### Hierarchical Cluster
Starting with each image sample as a node, merge them into a tree containing 3 - 20 nodes as image (and prompt) clusters.

### Propmt Keyword Mining
for every cluster, obtain the importance of each keywords from the prompts of the cluster in _a set of keywords?_, using __tf-idf__ algorithm. 
- since some keywords may contain many words, such as _unreal engine_, use __n-gram__ to detect multiple word phrases. 

>Q : where is the set of keywords come from? Is the set of keywords generated from image-prompt clusters? Or we define a list of some keywords first? 

### Prompt-Cluster Matching
After getting keywords with importance values of each cluster, normalize importance values of same cluster into unified-scope values, and find the keyword with highest importance value (tf-idf value).   


## UI
### Components
 - input view
 - browser
 - image evaluation
 - local exploration
   - result detail panel : images & prompts & hyperparameter values.
   - prompt keyword panel : show prompt keywords ranked by importance and visualize interrelationships between keywords using __BioFabric__. 
   - guidance scale panel : visualizes the distribution of the guidance scales of the selected images in a histogram.

> Q : if user enter a keyword pair that we have got their importance values, we can do the image evaluation part, but what if the user enter some criteria that we didn't consider?

### Details
 1. choose image nearest to each cluster's center as representitive image for the results overview.
 2. the position of prompt keywords is relevant to the position of image clusters and how often the cluster contains this keword. 
 3. the user input keywords for image evaluation will go through CLIP algorithm with each image, after obtain cosine-similarity, show the image rating between pair of keywords (from 0 to 1).


## Observations
 1. user start with simple sentences and keep enhance details.
 2. users were unable to achieve desired results with detailed descriptions and needed summarizing suggestions
 3. the selective replacement of certain keywords can have large effect.

## Future Works
 - add other parameters except guidance scale, such as inference step for denoising.
 - combine with deep learning model, such as GPT.


 ## Reference Information
- __CLIP Model :__ CLIP model receives an image and text prompt, returns a value of similarity between the image and prompt (ussually between 0 and 1). When optimizing the model accuracy, cosine distance between _anchor sample_ and _positive sample_ (for maximize), and consine distance between _anchor sample_ and _negative sample_ (for minimize) are needed.
- __t-SNE Algorithm :__
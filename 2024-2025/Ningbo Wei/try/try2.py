from transformers import AutoModel

model_name = "Xenova/all-MiniLM-L6-v2"
model = AutoModel.from_pretrained(model_name)
model.save_pretrained("path_to_save_model")

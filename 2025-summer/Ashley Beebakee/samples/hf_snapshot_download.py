from huggingface_hub import snapshot_download

# Download Hugging Face Model
model_id = "Enter repo ID here"
local_dir = "./Enter file path here"

snapshot_download(
    repo_id=model_id,
    local_dir=local_dir,
    local_dir_use_symlinks=False
)

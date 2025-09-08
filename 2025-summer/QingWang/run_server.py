import os
import subprocess
import sys

# ====== 在这里放你的真实 OpenAI key ======
os.environ["OPENAI_API_KEY"] = "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"

# ====== 配置 Vitality2 后端 ======
os.environ["ZCA_BACKEND"] = "vitality2"
os.environ["V2_BASE_URL"] = "http://127.0.0.1:3000"
os.environ["ZCA_MODEL"] = "gpt-4o-mini"

# ====== 启动 uvicorn ======
cmd = [
    sys.executable, "-m", "uvicorn",
    "my_project.zca_api:app",
    "--host", "127.0.0.1",
    "--port", "3031",
    "--reload"
]
print("Launching:", " ".join(cmd))
subprocess.run(cmd)

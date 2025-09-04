import asyncio
import sys
import uvicorn

# ✅ 修复 Windows 上 Playwright 的事件循环问题
if sys.platform.startswith("win") and sys.version_info >= (3, 8):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# ✅ 启动 FastAPI 应用（main.py 中定义了 app）
uvicorn.run("product_scraper.main:app", host="127.0.0.1", port=8000)

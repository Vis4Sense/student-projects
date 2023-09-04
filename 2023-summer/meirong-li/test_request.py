import requests
from bs4 import BeautifulSoup

from src.utils import get_headers


url = "https://www.amazon.co.uk/dp/B0CF4P3K48/ref=sspa_dk_detail_2?pd_rd_i=B0CF4P3K48&pd_rd_w=zl50z&content-id=amzn1.sym.84ea1bf1-65a8-4363-b8f5-f0df58cbb686&pf_rd_p=84ea1bf1-65a8-4363-b8f5-f0df58cbb686&pf_rd_r=41AEHMRF2EXMP5CQESR0&pd_rd_wg=dWIjI&pd_rd_r=84769cd8-e310-4a99-b38f-7bb8c2445f02&s=photo&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1"
headers = get_headers()
page = requests.get(url, headers=headers)
print(page.text)
soup = BeautifulSoup(page.content, "html.parser")

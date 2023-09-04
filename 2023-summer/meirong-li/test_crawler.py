import json
from src.utils import logger, get_headers, debug
from crawler.amazon_search_crawler import AmazonSearchCrawler
from crawler.amazon_item_crawler import AmazonItemCrawler


if __name__ == "__main__":
    logger.info("debug %s", debug)

    headers = get_headers(path="headers.json")
    logger.info("json %s" % json.dumps(headers))

    search_crawler = AmazonSearchCrawler(url="https://www.amazon.co.uk/s?k=camera&page=1", headers=headers, debug=debug)
    for url in search_crawler.crawl():
        logger.info("url %s" % url)

    item_crawler = AmazonItemCrawler(
        url="https://www.amazon.co.uk/Digital-Compact-Battery-Teenager-Beginner-Black/dp/B0B99QJSNK/keywords=camera",
        headers=headers,
        debug=debug,
    )
    item_crawler.crawl()

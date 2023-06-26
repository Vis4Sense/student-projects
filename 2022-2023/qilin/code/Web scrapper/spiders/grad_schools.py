import scrapy

class SchoolsSpider(scrapy.Spider):
    name = "schools"
    start_urls = ["https://csrankings.org/#/index?all&us"]

    def parse(self, response):
        for row in response.css("table > tbody > tr"):
            rank = row.css("td:nth-child(1)::text").get()
            name = row.css("td:nth-child(2) > a::text").get()
            if rank is not None and name is not None:
                yield {
                    "rank": rank.strip(),
                    "name": name.strip(),
                }

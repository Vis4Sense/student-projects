
import scrapy


class AmazonSpider(scrapy.Spider):
    name = "amazon"

    def start_requests(self):
        urls = [
            'https://www.amazon.com/s?k=camera'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for product in response.xpath("//div[@class='s-include-content-margin s-border-bottom']"):
            yield {
                'title': product.xpath(".//h2/a/span/text()").get(),
                'price': product.xpath(".//span[@class='a-price-whole']/text() |"
                                        ".//span[@class='a-price']/span[@class='a-offscreen']/text()").get(),
            }

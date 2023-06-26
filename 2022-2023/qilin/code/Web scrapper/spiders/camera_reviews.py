import scrapy

class AmazonReviewsSpider(scrapy.Spider):
    name = "camera_reviews"
    start_urls = [
        'https://www.amazon.com/Digital-Vlogging-180%C2%B0Flip-Compact-YouTube/dp/B0BKFSY9D7/ref=sr_1_1_sspa?keywords=top+10+cameras+for+family&qid=1678113885&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzNUoySEVaTzROTEhOJmVuY3J5cHRlZElkPUEwMDU4NjYwMUtXMUowWDdVNDBGUCZlbmNyeXB0ZWRBZElkPUEwMDM1MDU0OFQzSTZNVDVWUzRJJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='
    ]

    def parse(self, response):
        for review in response.xpath('//div[@data-hook="review"]'):
            yield {
                'title': review.xpath('.//a[@data-hook="review-title"]/span/text()')
                            .getall(),
                'rating': review.xpath('.//i[@data-hook="review-star-rating"]//text()')
                             .get(default='').strip(),
                'text': review.xpath('.//div[@data-hook="review-collapsed"]/span/text()')
                             .getall(),
                'author': review.xpath('.//span[@class="a-profile-name"]/text()')
                             .get(default='').strip(),
                'date': review.xpath('.//span[@data-hook="review-date"]/text()')
                           .get(default='').strip()
            }


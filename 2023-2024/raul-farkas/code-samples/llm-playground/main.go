package main

import (
	"fmt"
	"sync"
)

// Generate sample articles
var Articles = []Article{
	{text: "FINANCING OF ASPOCOMP 'S GROWTH Aspocomp is aggressively pursuing its growth strategy by increasingly focusing on technologically more demanding HDI printed circuit boards PCBs."},
	{text: "According to Gran , the company has no plans to move all production to Russia , although that is where the company is growing."},
	{text: "A tinyurl link takes users to a scamming site promising that users can earn thousands of dollars by becoming a Google ( NASDAQ : GOOG ) Cash advertiser."},
	{text: "Apple Forecasts Flat Sales In Holiday Quarter; Shares Fall"},
	{text: "Dow Jones Futures Rise, Apple Falls On Holiday Outlook; Jobs Report Due"},
}

// Instantiate LLM structs
var chatgptLLM = NewChatGPTLLM()

var replicateLLM = NewReplicateLLM()

var Processors = []SentimentAnalyser{&chatgptLLM, &replicateLLM}

func main() {

	var pwg sync.WaitGroup
	pch := make(chan *Prompt)
	// For each LLM generate a sentiment analysis output
	for _, p := range Processors {

		for _, art := range Articles {
			pwg.Add(1)

			prmpt := NewPrompt()
			go p.analyse(prmpt.Article(art), pch, &pwg)
		}

	}
	go func() {
		pwg.Wait()
		close(pch)
	}()

	for result := range pch {
		fmt.Printf("Service: %s\nArticle: %s\nOutput: %s\n\n", result.provider.Name(), result.article.text, result.article.evaluation)
	}

}

package main

import (
	"fmt"
	"sync"
)

// Prompt to be asked to the LLM
type Prompt struct {
	preamble string
	article  Article
	provider SentimentAnalyser
}

type Article struct {
	text       string
	evaluation string
}

// Generate new Prompt with given preamble
func NewPrompt() Prompt {
	return Prompt{
		preamble: "Instruction: What is the sentiment of this news? Please choose an answer from {negative/neutral/positive}. Respond with one word.\\nInput: ",
	}
}

func (p *Prompt) GetReadyPrompt() string {
	return fmt.Sprintf("%s%s", p.preamble, p.article.text)
}

// Set the article of the prompt
func (p *Prompt) Article(art Article) *Prompt {
	p.article = art
	return p
}

type SentimentAnalyser interface {
	analyse(*Prompt, chan<- *Prompt, *sync.WaitGroup)
	Name() string
}

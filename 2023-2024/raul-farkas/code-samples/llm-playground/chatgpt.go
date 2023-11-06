package main

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/ayush6624/go-chatgpt"
)

type ChatGPTLLM struct {
	name   string
	client *chatgpt.Client
}

func NewChatGPTLLM() ChatGPTLLM {
	token := os.Getenv("OPENAI_KEY")
	l := ChatGPTLLM{
		name: "ChatGPT",
	}
	if client, err := chatgpt.NewClient(token); err != nil {
		fmt.Printf("error occured %+v", err)
		os.Exit(-1)
	} else {
		l.client = client
	}
	return l
}

func (l *ChatGPTLLM) Name() string {
	return l.name
}

func (l *ChatGPTLLM) analyse(p *Prompt, res chan<- *Prompt, pwg *sync.WaitGroup) {
	ctx := context.Background()
	p.provider = l

	out, err := l.client.SimpleSend(ctx, p.GetReadyPrompt())
	if err != nil {
		fmt.Printf("ChatGPT error occured %+v", err)
		os.Exit(-1)
	}

	// To use other GPT-4
	// out, _ := l.client.Send(ctx, &chatgpt.ChatCompletionRequest{
	// 	Model: chatgpt.GPT4,
	// 	Messages: []chatgpt.ChatMessage{
	// 		{
	// 			Role:    chatgpt.ChatGPTModelRoleSystem,
	// 			Content: p.GetReadyPrompt(),
	// 		},
	// 	},
	// })

	p.article.evaluation = out.Choices[0].Message.Content
	pwg.Done()

	res <- p
}

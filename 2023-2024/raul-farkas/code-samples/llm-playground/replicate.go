package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type ReplicateLLM struct {
	name    string
	model   string
	owner   string
	version string
	token   string
}

func NewReplicateLLM() ReplicateLLM {
	token := os.Getenv("REPLICATE_KEY")

	return ReplicateLLM{
		model:   "llama-2-7b-chat",
		owner:   "meta",
		version: "13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
		token:   token,
		name:    "LLAMA",
	}
}

func (l *ReplicateLLM) Name() string {
	return l.name
}

type ReplHTTP struct {
	Urls struct {
		Get string `json:"Get"`
	} `json:"urls"`

	Output []string `json:"output"`
	Status string   `json:"status"`
}

func (l *ReplicateLLM) analyse(prompt *Prompt, res chan<- *Prompt, pwg *sync.WaitGroup) {
	// Prepare request prompt
	body := fmt.Sprintf(`{"version": "%s", "input": {"prompt": "%s"}}`, l.version, prompt.GetReadyPrompt())
	req, err := http.NewRequest(http.MethodPost, "https://api.replicate.com/v1/predictions", strings.NewReader(body))
	req.Header.Add("Authorization", fmt.Sprintf("Token %s", l.token))
	req.Header.Add("Content-Type", "application/json")
	prompt.provider = l
	if err != nil {
		fmt.Printf("Repl failed while generating the request with err %+v", err)
		os.Exit(-1)
	}

	r, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("Repl failed while sending request with err %+v", err)
		os.Exit(-1)
	}

	ob, err := io.ReadAll(r.Body)
	r.Body.Close()

	// Get struct of resulting JSON
	var replhttp ReplHTTP
	err = json.Unmarshal(ob, &replhttp)
	if err != nil {
		fmt.Printf("Repl failed while unmarshaling with err %+v", err)
		os.Exit(-1)
	}

	for replhttp.Status != "succeeded" {
		// While the response is not ready, try to get it again
		req, _ = http.NewRequest(http.MethodGet, replhttp.Urls.Get, nil)
		req.Header.Add("Authorization", fmt.Sprintf("Token %s", l.token))
		req.Header.Add("Content-Type", "application/json")
		r, err = http.DefaultClient.Do(req)
		ob, err = io.ReadAll(r.Body)
		r.Body.Close()
		err = json.Unmarshal(ob, &replhttp)
		if err != nil {
			fmt.Printf("Repl failed while trying to get response with err %+v", err)
			os.Exit(-1)
		}

		prompt.article.evaluation = strings.Trim(strings.Join(replhttp.Output, ""), " ")

		time.Sleep(time.Second)
	}

	pwg.Done()

	res <- prompt
}

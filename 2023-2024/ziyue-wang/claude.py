import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="sk-ant-api03-mrmRzF-1x397AtlRNiur-PEQ7TlpAf3HxY4YQXeyvfB1p642QIAiMYN4Qwv98mKPCJOhA-ZvoYKgAA",
)
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
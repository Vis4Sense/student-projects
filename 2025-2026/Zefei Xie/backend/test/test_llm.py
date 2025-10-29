"""
Author: Henry X
Date: 2025/10/29 18:18
File: test_llm.py
Description: [Add your description here]
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"


def test_non_streaming_chat():
    """测试非流式对话接口"""
    print("\n" + "=" * 50)
    print("Testing Non-Streaming Chat")
    print("=" * 50)

    url = f"{BASE_URL}/chat"
    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is Python? Answer in one sentence."}
        ]
    }

    print(f"\nRequest URL: {url}")
    print(f"Request Payload:\n{json.dumps(payload, indent=2)}")

    try:
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=30)
        elapsed_time = time.time() - start_time

        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Time: {elapsed_time:.2f}s")

        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Success!")
            print(f"Response:\n{json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"\n❌ Failed!")
            print(f"Error: {response.text}")

    except Exception as e:
        print(f"\n❌ Exception occurred: {str(e)}")


def test_streaming_chat():
    print("\n" + "=" * 50)
    print("Testing Streaming Chat")
    print("=" * 50)

    url = f"{BASE_URL}/chat/stream"
    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Write a short poem about coding (max 4 lines)."}
        ]
    }

    print(f"\nRequest URL: {url}")
    print(f"Request Payload:\n{json.dumps(payload, indent=2)}")

    try:
        print(f"\n📝 Streaming Response:")
        print("-" * 50)

        start_time = time.time()
        full_response = ""
        chunk_count = 0

        with requests.post(url, json=payload, stream=True, timeout=30) as response:
            if response.status_code != 200:
                print(f"\n❌ Failed! Status Code: {response.status_code}")
                print(f"Error: {response.text}")
                return

            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')

                    # Parse SSE format
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]  # Remove 'data: ' prefix

                        if data_str == '[DONE]':
                            break

                        try:
                            chunk_data = json.loads(data_str)
                            if 'content' in chunk_data:
                                content = chunk_data['content']
                                print(content, end='', flush=True)
                                full_response += content
                                chunk_count += 1
                            elif 'error' in chunk_data:
                                print(f"\n❌ Error: {chunk_data['error']}")
                                return
                        except json.JSONDecodeError:
                            print(f"\n⚠️  Failed to parse: {data_str}")

        elapsed_time = time.time() - start_time

        print("\n" + "-" * 50)
        print(f"\n✅ Streaming completed!")
        print(f"Total chunks: {chunk_count}")
        print(f"Total characters: {len(full_response)}")
        print(f"Response Time: {elapsed_time:.2f}s")

    except Exception as e:
        print(f"\n❌ Exception occurred: {str(e)}")


def test_multi_turn_conversation():
    print("\n" + "=" * 50)
    print("Testing Multi-turn Conversation")
    print("=" * 50)

    url = f"{BASE_URL}/chat"

    conversation = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "My name is Alice."},
    ]

    # First turn
    print("\n--- Turn 1 ---")
    print(f"User: {conversation[1]['content']}")

    response = requests.post(url, json={"messages": conversation}, timeout=30)
    if response.status_code == 200:
        assistant_msg = response.json()["message"]
        print(f"Assistant: {assistant_msg}")
        conversation.append({"role": "assistant", "content": assistant_msg})
    else:
        print(f"❌ Failed: {response.text}")
        return

    # Second turn
    conversation.append({"role": "user", "content": "What's my name?"})

    print("\n--- Turn 2 ---")
    print(f"User: {conversation[-1]['content']}")

    response = requests.post(url, json={"messages": conversation}, timeout=30)
    if response.status_code == 200:
        assistant_msg = response.json()["message"]
        print(f"Assistant: {assistant_msg}")

        if "Alice" in assistant_msg:
            print("\n✅ Successfully remembered the name!")
        else:
            print("\n⚠️  Failed to remember the name")
    else:
        print(f"❌ Failed: {response.text}")


def test_error_handling():
    print("\n" + "=" * 50)
    print("Testing Error Handling")
    print("=" * 50)

    url = f"{BASE_URL}/chat"

    # Test 1: Empty messages
    print("\n--- Test 1: Empty messages ---")
    response = requests.post(url, json={"messages": []}, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")

    # Test 2: Invalid role
    print("\n--- Test 2: Invalid message format ---")
    response = requests.post(
        url,
        json={"messages": [{"role": "invalid", "content": "test"}]},
        timeout=30
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")

    # Test 3: Missing content
    print("\n--- Test 3: Missing content ---")
    response = requests.post(
        url,
        json={"messages": [{"role": "user"}]},
        timeout=30
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")


def main():
    print("\n" + "🚀 " * 20)
    print("Starting Chat API Tests")
    print("🚀 " * 20)

    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print(f"\n✅ Server is running")
        print(f"Server info: {response.json()}")
    except Exception as e:
        print(f"\n❌ Server is not running: {str(e)}")
        print("Please start the server first: python main.py")
        return

    test_non_streaming_chat()
    time.sleep(1)

    test_streaming_chat()
    time.sleep(1)

    test_multi_turn_conversation()
    time.sleep(1)

    test_error_handling()

    print("\n" + "🎉 " * 20)
    print("All Tests Completed!")
    print("🎉 " * 20)


if __name__ == "__main__":
    main()

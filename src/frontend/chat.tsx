import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"
import ChatPrompt from "@/frontend/chat/components/chat-prompt"
import { useChat } from '@ai-sdk/react';

const messages = [
  {
    "id": "nShm74VY8DAykRg5",
    "createdAt": "2025-06-18T05:35:31.027Z",
    "role": "user",
    "content": "yooo",
    "parts": [
      {
        "type": "text",
        "text": "yooo"
      }
    ]
  },
  {
    "id": "msg-JrBkf5jW4fty4aBN5QxaFr0V",
    "createdAt": "2025-06-18T05:35:34.043Z",
    "role": "assistant",
    "content": "Yo! What's up? How can I help you today?\n",
    "parts": [
      {
        "type": "step-start"
      },
      {
        "type": "text",
        "text": "Yo! What's up? How can I help you today?\n"
      }
    ],
    "revisionId": "jg9kAScxmiVMrj2M"
  },
  {
    "id": "1m0diQ9ujMOMOUy8",
    "createdAt": "2025-06-18T05:35:59.515Z",
    "role": "user",
    "content": "give me a 5 line poem in hindi",
    "parts": [
      {
        "type": "text",
        "text": "give me a 5 line poem in hindi"
      }
    ]
  },
  {
    "id": "msg-nrjHZIJMc9Q8aSL5itY0g23I",
    "createdAt": "2025-06-18T05:36:01.644Z",
    "role": "assistant",
    "content": "Okay, here's a 5-line poem in Hindi:\n\nसूरज की किरणें, फैली हैं आज,\nनई उम्मीदों का, हुआ है आगाज़।\nदिल में उमंग है, आँखों में प्यार,\nखुशियों से भर दे, ये संसार।\nज़िन्दगी का हर पल, है एक साज।\n\n**(Translation):**\n\nThe sun's rays, have spread today,\nA new hope, has begun.\nThere's enthusiasm in the heart, love in the eyes,\nFill this world with happiness.\nEvery moment of life, is a melody.\n",
    "parts": [
      {
        "type": "step-start"
      },
      {
        "type": "text",
        "text": "Okay, here's a 5-line poem in Hindi:\n\nसूरज की किरणें, फैली हैं आज,\nनई उम्मीदों का, हुआ है आगाज़।\nदिल में उमंग है, आँखों में प्यार,\nखुशियों से भर दे, ये संसार।\nज़िन्दगी का हर पल, है एक साज।\n\n**(Translation):**\n\nThe sun's rays, have spread today,\nA new hope, has begun.\nThere's enthusiasm in the heart, love in the eyes,\nFill this world with happiness.\nEvery moment of life, is a melody.\n"
      }
    ],
    "revisionId": "t8sPKBoxV1qXKc6i"
  }
]

export default function ChatContent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <ChatPrompt
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
        <SettingNavSvg className="z-20 h-16 w-20" />
        <SettingNav />
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>
    </>
  )
}

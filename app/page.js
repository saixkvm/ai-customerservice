'use client'
import Image from "next/image";
import {useState} from 'react'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField, Button } from "@mui/material";


export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I'm the HeadStarter support agent. How can I assist you today?`
  }])

  const [message, setMessage] = useState('');


  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1) 
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box 
    width="100vw" 
    height="100vh" 
    display = "flex" 
    flexDirection = "column"
    justifyContent="center" 
    alignItems="center"
    >
    
      <Stack  
        direction = "column"
        width = "600px"
        height = "600px"
        border = "1px solid black"
        p = {2}
        spacing = {3}>
          <Stack 
          direction = "column" 
          spacing = {2} 
          flexGrow = {1} 
          maxHeight = "100%" 
          overflow="auto">
            {
              messages.map((message,index)=> (
                <Box key = {index} display = 'flex' justifyContent = {
                  message.role === "assistant" ? 'flex-start' : 'flex-end'
                }
                >
                  <Box 
                    bgcolor = {
                      message.role === "assistant" ? 'primary.main' : 'secondary.main'
                    }
                    color = "white"
                    borderRadius = {14}
                    p = {3}
                    fontSize={13}
                    >
                      {message.content}
                  </Box>
                
                </Box>
              ))
            }
          
          </Stack>

          <Stack direction = "row" spacing={2}>
            <TextField
              label = "message"
              fullWidth 
              value = {message}
              onChange={(e) => setMessage(e.target.value)}/>

            <Button variant = "contained" onClick = {sendMessage}>send</Button>
          </Stack>
        </Stack>
    </Box>
  )
}

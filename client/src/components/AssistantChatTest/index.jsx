import { useState } from 'react';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { toast } from 'react-toastify';
import { getAiRespose } from '../../services/asistanService';

async function* streamReader(response) {
    const stream = response.body;
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const decodedChunck = decoder.decode(value, { stream: true });
        yield decodedChunck;
    }
}
export default function AssistantChatTest() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const renderMessageToAssistant = (chunk, messagesUpdated) => {
        if (messagesUpdated[messagesUpdated.length - 1].role === 'assistant') {
            messagesUpdated[messagesUpdated.length - 1].content += chunk;
        } else {
            const newMessage = { role: 'assistant', content: chunk };
            messagesUpdated.push(newMessage);
        }
        setMessages([...messagesUpdated]);
    }
    const handleSubmit = async () => {
        if (inputMessage.trim() === '') return;
        const newMessage = { role: 'user', content: inputMessage };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputMessage('');
        try {
            const response = await getAiRespose(updatedMessages)
            if (!response.ok || !response.body) {
                return toast.error('Error al enviar el mensaje');
            }
            for await (const chunk of streamReader(response)) {
                renderMessageToAssistant(chunk, updatedMessages);
            }
        } catch (error) {
            toast.error('Error al enviar el mensaje');
        }
    };

    return (
        <Stack sx={{ width: '60%' }}>
            <Typography textAlign="center" variant="h5" color="textPrimary" gutterBottom>
                Test Chat
            </Typography>
            <Box sx={{ position: 'relative', height: 'calc(100vh - 250px)' }}>
                <Stack spacing={2} sx={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 320px)', padding: 2 }}>
                    {messages.map((message, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <TextField
                                value={message.content}
                                variant="filled"
                                multiline
                                sx={{ width: '50%', margin: 1 }}
                                focused
                                label={message.role === 'user' ? 'Tú' : 'Asistente'}
                                readOnly
                            />
                        </Box>
                    ))}
                </Stack>
                <form>
                    <Stack direction="row" bgcolor="background.default" sx={{ display: 'flex', position: 'absolute', bottom: 0, right: 10, left: 10 }}>
                        <TextField
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Escribe un mensaje"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                        />
                        <IconButton color="secondary" onClick={() => setMessages([])}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={handleSubmit}>
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form>
            </Box>
        </Stack>
    );
}

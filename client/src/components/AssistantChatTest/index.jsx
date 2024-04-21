import { useState } from 'react';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { getAiRespose } from '../../services/asistanService';
import toastError from '../../errors/toastError';
import { i18n } from '../../translate/i18n';
import streamReader from '../../services/streamReader';

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
                const res = await response.json();
                return toastError(res);
            }
            for await (const chunk of streamReader(response)) {
                renderMessageToAssistant(chunk, updatedMessages);
            }
        } catch (error) {
            toastError(error);
        }
    };

    return (
        <Stack sx={{ width: { lg: "60%", sm: "100%" } }}>
            <Typography sx={{
                display: {
                    xs: "none",
                    lg: "block"
                }
            }} textAlign="center" variant="h5" color="textPrimary" gutterBottom>
                {i18n.t('assistant.test.title')}
            </Typography>
            <Box sx={{ position: 'relative', height: { xs: 'calc(100vh - 260px)' } }}>
                <Stack spacing={2} sx={{ overflowY: 'scroll', height: 'calc(100vh - 300px)', padding: 2 }}>
                    {messages.map((message, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <TextField
                                value={message.content}
                                variant="filled"
                                multiline
                                sx={{ width: '50%', margin: 1 }}
                                focused
                                label={message.role === 'user' ? i18n.t("assistant.test.message.user") : i18n.t("assistant.test.message.assistant")}
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
                            placeholder={i18n.t('assistant.test.inputPlaceholder')}
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                        />
                        <IconButton color="secondary" onClick={() => setMessages([])}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton
                            color="primary"
                            disabled={inputMessage.trim() === ''}
                            onClick={handleSubmit}>
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form>
            </Box >
        </Stack >
    );
}

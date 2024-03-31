import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { createAssistant, updateAssistant } from "../../services/asistanService";
import { toast } from "react-toastify";
import { useState } from "react";
import toastError from "../../errors/toastError";

const MAX = 4096;
const MIN = 100;
const marks = [
    { value: MIN, label: '' },
    { value: MAX, label: '' },
];

const InitialModels = [{
    name: "gtp-3.5-turbo",
    id: 1,
    contextWindow: 4096
}
]


export default function AssistantConfiguration({ assistant, handleUpdateAssistant, models, onChangeKeyFromAsisstant }) {
    const initialModels = models.length ? models : InitialModels;
    const defaultModelId = assistant?.modelId || initialModels[0].id;
    const [isVisible, setIsVisible] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...assistant, id: assistant?.id, type: "chat_completions" };
            const getResponseApi = assistant?.id ? updateAssistant : createAssistant;
            const newData = await getResponseApi(data);
            handleUpdateAssistant(newData);
            toast.success("Asistente actualizado correctamente");
        } catch (error) {
            toastError(error);
        }
    };
    const setMaxtTokens = (value) => {
        onChangeKeyFromAsisstant("maxTokens", value);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChangeKeyFromAsisstant(name, value);
    };
    return (
        <form onSubmit={handleSubmit} style={{ width: "40%" }}>
            <Stack spacing={3} sx={{ width: "100%", padding: 1 }}>
                <Typography variant="h5" textAlign={"center"} color="textPrimary">
                    Configuración
                </Typography>
                <TextField
                    name="name"
                    required
                    label="Nombre"
                    value={assistant?.name || ""}
                    onChange={handleChange}

                />
                <FormControl variant="outlined">
                    <InputLabel

                        htmlFor="openaiApiKey"
                    >Openai Api Key</InputLabel>
                    <OutlinedInput
                        id="openaiApiKey"
                        name="openaiApiKey"
                        required
                        type={isVisible ? "text" : "password"}
                        label="OpenAI API Key"
                        value={assistant?.openaiApiKey || ""}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment
                                position="end">
                                <IconButton
                                    onClick={() => setIsVisible(!isVisible)}
                                >
                                    {isVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <TextField
                    name="instructions"
                    required
                    label="Instrucciones"
                    multiline
                    minRows={4}
                    maxRows={5}
                    value={assistant?.instructions || ""}
                    onChange={handleChange}
                />
                <FormControl fullWidth>
                    <InputLabel id="model-select-label">Model</InputLabel>
                    <Select
                        variant="filled"
                        name="modelId"
                        value={defaultModelId}
                        onChange={handleChange}
                        labelId="model-select-label"
                    >
                        {initialModels.map((model) => (
                            <MenuItem key={model.id} value={model.id}>
                                {`${model.name} - ${model.contextWindow} tokens de contexto`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <MaxTokensSlider maxTokens={assistant.maxTokens} setMaxTokens={setMaxtTokens} />
                <Stack alignItems={"center"}>
                    <LoadingButton variant="contained" type="submit">Guardar</LoadingButton>
                </Stack>
            </Stack>
        </form>
    );
}

function MaxTokensSlider({ setMaxTokens, maxTokens }) {

    const handleChageMaxTokens = (_, newValue) => {
        setMaxTokens(newValue);
    };

    return (
        <Box>
            <Typography id="max-tokens-slider">Máximo de tokens</Typography>
            <Slider
                marks={marks}
                step={10}
                aria-labelledby="max-tokens-slider"
                valueLabelDisplay="auto"
                min={MIN}
                max={MAX}
                value={maxTokens}
                onChange={handleChageMaxTokens}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                    variant="body2"
                    onClick={() => setMaxTokens(MIN)}
                    sx={{ cursor: "pointer" }}
                >
                    {MIN} min
                </Typography>
                <Typography
                    variant="body2"
                    onClick={() => setMaxTokens(MAX)}
                    sx={{ cursor: "pointer" }}
                >
                    {MAX} max
                </Typography>
            </Box>
        </Box>
    );
}

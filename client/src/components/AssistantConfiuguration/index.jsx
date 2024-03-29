import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
const Models = [
    {
        name: "model1",
        contextWindow: 5,
        id: 1
    }, {
        name: "model2",
        contextWindow: 5,
        id: 2
    }, {
        name: "model3",
        contextWindow: 5,
        id: 3
    }
]
const TypeAsisstants = [{
    name: "type1",
    id: 1
}, {
    name: "type2",
    id: 2
}]
export default function AssistantConfiguration() {
    const [model, setModel] = useState(1)
    const [type, setType] = useState(1)
    const handleChangeModel = (e) => {
        setModel(e.target.value)
    }
    const handleChangeType = (e) => {
        setType(e.target.value)
    }
    return (
        <Stack spacing={3} sx={{ width: "40%", padding: 1 }}>
            <Typography variant="h5" textAlign={"center"} color="textPrimary">
                Configurarcion
            </Typography>
            <TextField
                label="Nombre"
            />
            <TextField
                label="Instrucciones"
                multiline
                minRows={4}
                maxRows={5}
            />
            <FormControl fullWidth>
                <InputLabel
                    id="type-select-label"
                >Tipo de Asistente</InputLabel>
                <Select
                    labelId="type-select-label"
                    value={type}
                    onChange={handleChangeType}
                    label="Typo de Asistente"
                    id="type-select"
                >

                    {
                        TypeAsisstants.map(type => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel
                    id="model-select-label"
                >Model</InputLabel>
                <Select
                    labelId="model-select-label"
                    value={model}
                    onChange={handleChangeModel}
                    label="Model"
                    id="model-select"
                >
                    {
                        Models.map(model => (
                            <MenuItem key={model.id} value={model.id}>
                                {`${model.name} - ${model.contextWindow} tokens de contexto`}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Stack>
    )
}

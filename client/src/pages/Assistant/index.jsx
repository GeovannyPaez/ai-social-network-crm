import { Divider, FormControlLabel, Switch, } from "@mui/material";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { MainPaper } from "../../components/StyledComponents";
import AssistanChatTest from "../../components/AssistantChatTest";
import AssistantConfiguration from "../../components/AssistantConfiuguration";
import { useEffect, useState } from "react";
import { getAssistant, updateAssistant } from "../../services/asistanService";
import { getModels } from "../../services/models";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
const initialState = {
    name: "",
    instructions: "",
    modelId: 1,
    maxTokens: 100,
    isActivated: false,
}
export default function AssistantPage() {
    const [models, setModels] = useState([]);
    const [assistant, setAssistant] = useState(initialState);
    useEffect(() => {
        async function fetchData() {
            const asssitant = await getAssistant();
            const models = await getModels();
            setModels(models);
            if (asssitant) setAssistant(asssitant);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const hanldeUpdateAssistant = (newAssistant) => {
        setAssistant(newAssistant);
    }
    const onChangeKeyFromAsisstant = (key, value) => {
        setAssistant({ ...assistant, [key]: value });
    }
    const handleActiveAssistant = async (e) => {
        try {
            const value = e.target.checked;
            await updateAssistant({ isActivated: value, id: assistant.id });
            onChangeKeyFromAsisstant("isActivated", value);
            toast.success(i18n.t("assistant.header.switch.success"));
        } catch (error) {
            toastError(error);
        }
    }
    return (
        <MainContainer>
            <MainHeader>
                <Title>{i18n.t("assistant.header.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <FormControlLabel
                        label={i18n.t("assistant.header.switch.isDesactivated")}
                        control={<Switch
                            disabled={!assistant.id}
                            checked={assistant.isActivated}
                            onChange={handleActiveAssistant}
                            color="primary"
                        />}
                    />
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <MainPaper sx={{ display: "flex", overflow: "hidden" }}>
                <AssistantConfiguration
                    onChangeKeyFromAsisstant={onChangeKeyFromAsisstant}
                    assistant={assistant || initialState}
                    handleUpdateAssistant={hanldeUpdateAssistant}
                    models={models}
                />
                <Divider orientation="vertical" />
                <AssistanChatTest />
            </MainPaper >
        </MainContainer >
    )
}

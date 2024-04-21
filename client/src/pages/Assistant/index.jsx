import { Box, Divider, Tab, useMediaQuery } from "@mui/material";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { MainPaper } from "../../components/StyledComponents";
import AssistanChatTest from "../../components/AssistantChatTest";
import AssistantConfiguration from "../../components/AssistantConfiuguration";
import { useEffect, useState } from "react";
import { getAssistant } from "../../services/asistanService";
import AssistantActivationMenu from "../../components/AssistantActivationModal";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const initialState = {
    name: "",
    instructions: "",
    maxTokens: 100,
    isActivated: false,
};

export default function AssistantPage() {
    const [assistant, setAssistant] = useState(initialState);
    const [showTabs, setShowTabs] = useState(false); // Estado para controlar si se muestran los tabs o el contenido completo
    const [tabValue, setValue] = useState("1");

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        async function fetchData() {
            const asssitant = await getAssistant();
            if (asssitant) setAssistant(asssitant);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Verificar el tamaño de la pantalla y actualizar el estado para mostrar los tabs o el contenido completo
    const isLargeScreen = useMediaQuery('(min-width:960px)');
    useEffect(() => {
        setShowTabs(!isLargeScreen);
    }, [isLargeScreen]);

    const hanldeUpdateAssistant = (newAssistant) => {
        setAssistant({ ...assistant, ...newAssistant });
    };

    const onChangeKeyFromAsisstant = (key, value) => {
        setAssistant({ ...assistant, [key]: value });
    };

    return (
        <MainContainer>
            <MainHeader>
                <Title>{i18n.t("assistant.header.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <AssistantActivationMenu
                        assistantId={assistant.id}
                        isActivated={assistant.isActivated}
                        isActivatedForAllTickets={assistant.isActivatedForAllTickets}
                        onChangeKeyFromAsisstant={onChangeKeyFromAsisstant}
                        handleUpdateAssistant={hanldeUpdateAssistant}
                    />
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <MainPaper sx={{
                display: "flex", maxHeight: "100% ", overflow: "hidden", padding: 0
            }}>
                {
                    showTabs ? (
                        <>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={tabValue}>
                                    <TabList
                                        sx={{
                                            '& > :first-child': {
                                                '& > :first-child': {
                                                    justifyContent: "space-around"
                                                }
                                            }
                                        }}
                                        onChange={handleChangeTab}
                                        aria-label="Menu mobile assistant"
                                    >
                                        <Tab label="Configuración" value="1" />
                                        <Tab label="Prueba" value="2" />
                                    </TabList>
                                    <TabPanel sx={{ padding: 0 }} value="1">
                                        <AssistantConfiguration
                                            onChangeKeyFromAsisstant={onChangeKeyFromAsisstant}
                                            assistant={assistant || initialState}
                                            handleUpdateAssistant={hanldeUpdateAssistant}
                                        />
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <AssistanChatTest />
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </>
                    ) : (
                        <>
                            <AssistantConfiguration
                                onChangeKeyFromAsisstant={onChangeKeyFromAsisstant}
                                assistant={assistant || initialState}
                                handleUpdateAssistant={hanldeUpdateAssistant}
                            />
                            <Divider orientation="vertical" />
                            <AssistanChatTest />
                        </>
                    )
                }
            </MainPaper >
        </MainContainer >
    );
}

import { Button, Divider, FormControlLabel, Switch, } from "@mui/material";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { MainPaper } from "../../components/StyledComponents";
import AssistanChatTest from "../../components/AssistantChatTest";
import AssistantConfiguration from "../../components/AssistantConfiuguration";

export default function Asistant() {
    return (
        <MainContainer>
            <MainHeader>
                <Title>{i18n.t("assistant.header.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <FormControlLabel label={i18n.t("assistant.header.switch.isDesactivated")} control={<Switch />} />
                    <Button variant="contained">
                        {i18n.t("assistant.header.save")}
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <MainPaper sx={{ display: "flex" }}>
                <AssistantConfiguration />
                <Divider orientation="vertical" />
                <AssistanChatTest />
            </MainPaper >
        </MainContainer >
    )
}

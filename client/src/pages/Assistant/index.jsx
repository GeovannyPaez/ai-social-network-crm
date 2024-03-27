import { Button } from "@mui/material";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { MainPaper } from "../../components/StyledComponents";

export default function Asistant() {
    return (
        <MainContainer>
            <MainHeader>
                <Title>{i18n.t("assistant.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <Button variant="contained" color="secondary">
                        Activar
                    </Button>
                    <Button variant="contained">
                        Crear Asistente
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <MainPaper>
                <p>No pasa nada</p>
            </MainPaper>
        </MainContainer>
    )
}

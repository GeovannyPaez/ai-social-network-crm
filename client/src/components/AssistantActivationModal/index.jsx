import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, Switch } from '@mui/material';
import { i18n } from '../../translate/i18n';
import { updateAssistant } from '../../services/asistanService';
import toastError from '../../errors/toastError';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';


export default function AssistantActivationModal({ assistantId, isActivated, isActivatedForAllTickets, handleUpdateAssistant, onChangeKeyFromAsisstant }) {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true);
        try {
            await updateAssistant({ isActivated, isActivatedForAllTickets, id: assistantId });
            toast.success(i18n.t("assistant.header.toast.success"))
        } catch (error) {
            toastError(error);
            handleUpdateAssistant({ isActivated: false, isActivatedForAllTickets: false });
        }
        setIsLoading(false);
        handleClose();
    }
    const handleChange = (event) => {
        const { name, checked } = event.target;
        if (name == "isActivatedForAllTickets" && checked && !isActivated) {
            handleUpdateAssistant({ isActivated: true, isActivatedForAllTickets: checked })
            return;
        }
        onChangeKeyFromAsisstant(name, checked);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const labelIsActivated = !isActivated ? i18n.t("assistant.header.switch.active") : i18n.t("assistant.header.switch.desactive");
    const labelIsActivatedForAllTickets = !isActivatedForAllTickets ? i18n.t("assistant.header.switch.isDesactivatedForAllTickets") : i18n.t("assistant.header.switch.isActivatedForAllTickets");
    return (
        <React.Fragment>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
                Activar Assistente
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit
                }}
            >
                <DialogTitle>Activacion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para activar el asistente, cambie el estado a activado de cada uno de los activadores.
                    </DialogContentText>
                    <FormControlLabel
                        sx={{ display: "block" }}
                        name='isActivated'
                        label={labelIsActivated}
                        control={<Switch
                            disabled={!assistantId}
                            name='isActivated'
                            id="isActivated"
                            onChange={handleChange}
                            checked={isActivated}
                            color="primary"
                        />}
                    />
                    <FormControlLabel
                        name='isActivatedForAllTickets'
                        label={labelIsActivatedForAllTickets}
                        control={<Switch
                            disabled={!assistantId}
                            name='isActivatedForAllTickets'
                            onChange={handleChange}
                            checked={isActivatedForAllTickets}
                            color="primary"
                        />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isLoading}
                    >
                        Save
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

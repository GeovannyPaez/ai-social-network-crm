import  { useState, useEffect } from "react";
import openSocket from "../../services/socket-io.js";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import manualDocuement from "../../assets/manual.pdf"
import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";
import { Button } from "@mui/material";
import { PaperSettings, RootSettings } from "../../components/StyledComponents/index.jsx";

const Settings = () => {

	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	useEffect(() => {
		const socket = openSocket();

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	return (
		<RootSettings>
			<Container maxWidth="sm">
				<Typography variant="h4" color="textPrimary" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<PaperSettings>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						sx={{ marginLeft: "auto"}}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>
				</PaperSettings>

				{/* <Paper className={classes.paper}>
					<TextField
						id="api-token-setting"
						readonly
						label="Token Api"
						margin="dense"
						variant="outlined"
						fullWidth
						color="textSecondary"
						value={settings && settings.length > 0 && getSettingValue("userApiToken")}
					/>
				</Paper> */}
				<PaperSettings style={{ justifyContent: "space-between" }}>
					<a download href={manualDocuement}>
						<Button variant="contained" color="secondary">
							Descargar Manual
						</Button>

					</a>
					<a rel="noreferrer" target="_blank" href={"https://api.whatsapp.com/send/?phone=%2B573158227811&text&type=phone_number&app_absent=0"}>
						<Button variant="contained" color="primary">Soporte</Button>
					</a>
				</PaperSettings>
			</Container>
		</RootSettings>
	);
};

export default Settings;

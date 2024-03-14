import  { useEffect, useState } from "react";
import { styled } from '@mui/system'; // Importar styled de @mui/system
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

// Usar styled para definir estilos
const ChipsWrapper = styled('div')({
	display: "flex",
	flexWrap: "wrap",
});

const StyledChip = styled(Chip)(({  backgroundColor }) => ({
	margin: 2,
	backgroundColor: backgroundColor,
}));

const QueueSelect = ({ selectedQueueIds, onChange }) => {
	const [queues, setQueues] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await api.get("/queue");
				setQueues(data);
			} catch (err) {
				toastError(err);
			}
		})();
	}, []);

	const handleChange = e => {
		onChange(e.target.value);
	};

	return (
		<div style={{ marginTop: 6 }}>
			<FormControl fullWidth margin="dense" variant="outlined">
				<FormLabel>{i18n.t("queueSelect.inputLabel")}</FormLabel>
				<Select
					multiple
					labelWidth={60}
					value={selectedQueueIds}
					onChange={handleChange}
					MenuProps={{
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
						getContentAnchorEl: null,
					}}
					renderValue={selected => (
						<ChipsWrapper>
							{selected?.length > 0 &&
								selected.map(id => {
									const queue = queues.find(q => q.id === id);
									return queue ? (
										<StyledChip
											key={id}
											backgroundColor={queue.color}
											variant="outlined"
											label={queue.name}
										/>
									) : null;
								})}
						</ChipsWrapper>
					)}
				>
					{queues.map(queue => (
						<MenuItem key={queue.id} value={queue.id}>
							{queue.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default QueueSelect;

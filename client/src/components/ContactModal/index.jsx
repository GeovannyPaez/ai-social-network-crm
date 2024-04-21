import { useState, useEffect } from "react";

import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import { styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { InputsWrapper } from "../StyledComponents";
import { FormControl, FormControlLabel, Switch } from "@mui/material";

const Root = styled("div")({
	display: "flex",
	flexWrap: "wrap",
});

const ExtraAttr = styled("div")({
	display: "flex",
});
const ButtonProgress = styled(CircularProgress)({
	color: green[500],
	position: "absolute",
	top: "50%",
	left: "50%",
	marginTop: -12,
	marginLeft: -12,

});
const ContactSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email"),
});

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {

	const initialState = {
		name: "",
		number: "",
		email: "",
		isAssistantActive: true
	};

	const [contact, setContact] = useState(initialState);

	const toogleAssistant = () => {
		setContact({ ...contact, isAssistantActive: !contact.isAssistantActive });
	}
	useEffect(() => {
		const fetchContact = async () => {
			if (initialValues) {
				setContact(prevState => {
					return { ...prevState, ...initialValues };
				});
			}

			if (!contactId) return;

			try {
				const { data } = await api.get(`/contacts/${contactId}`);
				setContact(data);
			} catch (err) {
				toastError(err);
			}
		};

		fetchContact();
	}, [contactId, open, initialValues]);

	const handleClose = () => {
		onClose();
		setContact(initialState);
	};

	const handleSaveContact = async values => {
		try {
			if (contactId) {
				await api.put(`/contacts/${contactId}`, values);
				handleClose();
			} else {
				const { data } = await api.post("/contacts", values);
				if (onSave) {
					onSave(data);
				}
				handleClose();
			}
			toast.success(i18n.t("contactModal.success"));
		} catch (err) {
			toastError(err);
		}
	};
	return (
		<Root>
			<Dialog open={open} onClose={handleClose} maxWidth="lg" scroll="paper">
				<DialogTitle sx={{ display: "flex", justifyContent: "space-around" }} id="form-dialog-title">
					{contactId
						? `${i18n.t("contactModal.title.edit")}`
						: `${i18n.t("contactModal.title.add")}`}
					{contactId && (<FormControl>
						<FormControlLabel
							labelPlacement="bottom"
							label={i18n.t("contactModal.title.isAssistantActive")}
							onChange={toogleAssistant}
							checked={contact.isAssistantActive}
							control={
								<Switch />
							}
						/>
					</FormControl>)}
				</DialogTitle>

				<Formik
					initialValues={contact}
					enableReinitialize={true}
					validationSchema={ContactSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveContact(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, errors, touched, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<Typography variant="subtitle1" gutterBottom>
									{i18n.t("contactModal.form.mainInfo")}
								</Typography>
								<InputsWrapper>
									<Field
										as={TextField}
										label={i18n.t("contactModal.form.name")}
										name="name"
										autoFocus
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										margin="dense"

									/>
									<Field
										as={TextField}
										label={i18n.t("contactModal.form.number")}
										name="number"
										error={touched.number && Boolean(errors.number)}
										helperText={touched.number && errors.number}
										placeholder="5513912344321"
										variant="outlined"
										margin="dense"
									/>
								</InputsWrapper>
								<div>
									<Field
										as={TextField}
										label={i18n.t("contactModal.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										placeholder="Email address"
										fullWidth
										margin="dense"
										variant="outlined"
									/>
								</div>
								<Typography
									style={{ marginBottom: 8, marginTop: 12 }}
									variant="subtitle1"
								>
									{i18n.t("contactModal.form.extraInfo")}
								</Typography>

								<FieldArray name="extraInfo">
									{({ push, remove }) => (
										<>
											{values.extraInfo &&
												values.extraInfo.length > 0 &&
												values.extraInfo.map((info, index) => (
													<ExtraAttr
														key={`${index}-info`}
													>
														<InputsWrapper>
															<Field
																as={TextField}
																label={i18n.t("contactModal.form.extraName")}
																name={`extraInfo[${index}].name`}
																variant="outlined"
																margin="dense"
															/>
															<Field
																as={TextField}
																label={i18n.t("contactModal.form.extraValue")}
																name={`extraInfo[${index}].value`}
																variant="outlined"
																margin="dense"
															/>
														</InputsWrapper>
														<IconButton
															size="small"
															onClick={() => remove(index)}
														>
															<DeleteOutlineIcon />
														</IconButton>
													</ExtraAttr>
												))}
											<ExtraAttr>
												<Button
													style={{ flex: 1, marginTop: 8 }}
													variant="outlined"
													color="primary"
													onClick={() => push({ name: "", value: "" })}
												>
													{`+ ${i18n.t("contactModal.buttons.addExtraInfo")}`}
												</Button>
											</ExtraAttr>
										</>
									)}
								</FieldArray>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("contactModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									sx={{ position: "relative" }}
								>
									{contactId
										? `${i18n.t("contactModal.buttons.okEdit")}`
										: `${i18n.t("contactModal.buttons.okAdd")}`}
									{isSubmitting && (
										<ButtonProgress
											size={24}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</Root>
	);
};

export default ContactModal;

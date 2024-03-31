import styled from "@emotion/styled";
import { FormControl, InputLabel } from "@mui/material";
import { Form } from "formik";

export const StyledFormControl = styled(FormControl)`
    margin-top: 1rem;
`;

export const InputLabelStyled = styled(InputLabel)`
    margin-top: 1rem;
`;

export const FormWrapper = styled(Form)`
    width: 40%;
    max-height: calc(100vh - 200px);
    overflow-y: scroll;
    overflow-x: hidden;
`;
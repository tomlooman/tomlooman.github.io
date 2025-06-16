import React, { useState } from "react";
import { TextField } from "@mui/material";
import style from "./SingleInputForm.module.scss";

interface SingleInputFormProps {
    placeholder?: string;
    label: string;
    onSubmit: (email: string) => void;
    submitText: string;
    inputLabelProps?: any;
    inputProps?: any;
}

const SingleInputForm: React.FC<SingleInputFormProps> = ({ placeholder, label, onSubmit, submitText, inputLabelProps, inputProps }) => {
    const orange = "#f26535";
    const [value, setValue] = useState("");

    return (
        <div className={style.singleInputFormWrapper}>
            <TextField
                variant="outlined"
                size="small"
                value={value}
                placeholder={placeholder || ""}
                label={label}
                onChange={(e) => setValue(e.target.value)}
                classes={{ root: style.textFieldRoot }}
                slotProps={{
                    inputLabel: {
                        sx: {
                            '&.Mui-focused': {
                                color: orange,
                            },
                            ...inputLabelProps?.sx,
                        },
                        ...inputLabelProps,
                    },
                    input: {
                        sx: {
                            '&.MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: orange,
                                    borderWidth: 1,
                                },
                            },
                            ...inputProps?.sx,
                        },
                        ...inputProps
                    },
                }}
            />
            <button className={style.signUpButton} onClick={() => onSubmit(value)}>{submitText}</button>
        </div>
    );
}

export default SingleInputForm;
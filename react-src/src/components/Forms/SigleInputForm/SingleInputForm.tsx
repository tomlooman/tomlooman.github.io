import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useTheme, useMediaQuery } from '@mui/material';
import style from "./SingleInputForm.module.scss";

interface SingleInputFormProps {
    placeholder?: string;
    label: string;
    onSubmit: (email: string) => void;
    submitText: string;
    inputLabelProps?: any;
    inputProps?: any;
}

const SingleInputForm: React.FC<SingleInputFormProps> = ({
    placeholder,
    label,
    onSubmit,
    submitText,
    inputLabelProps,
    inputProps,
}) => {
    const orange = "#f26535";
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = async () => {
        if (!value || loading) return;

        try {
        setLoading(true);
        await onSubmit(value); // assume async
        } finally {
        setLoading(false);
        }
    };

    return (
        <form
            className={style.singleInputFormWrapper}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <TextField
                variant="outlined"
                size="small"
                value={value}
                placeholder={placeholder || ""}
                label={label}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
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
                    ...inputProps,
                },
                }}
            />

            <Button
                type="submit"
                disableElevation
                disableRipple
                className={style.signUpButton}
                disabled={loading || !value}
            >
                {loading ? (
                <CircularProgress size={16} color="inherit" />
                ) : isSmallScreen ? (
                <SendRoundedIcon />
                ) : (
                <>
                    {submitText}
                    <SendRoundedIcon style={{ marginLeft: 6 }} />
                </>
                )}
            </Button>
        </form>
    );
};

export default SingleInputForm;
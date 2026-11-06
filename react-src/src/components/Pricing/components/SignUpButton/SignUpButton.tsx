import React from 'react';
import Button from '@mui/material/Button';
import style from './SignUpButton.module.scss';

interface SignUpButtonProps {
    url?: string;
    label?: string;
}

const SignUpButton = ({url, label = "Buy Now"}: SignUpButtonProps) => {
    return (
        <div className={style.wrapper}>
            <Button variant="contained" classes={{ root: style.signUpButton }} href={url}>
                {label}
            </Button>
        </div>
    );
}

export default SignUpButton;

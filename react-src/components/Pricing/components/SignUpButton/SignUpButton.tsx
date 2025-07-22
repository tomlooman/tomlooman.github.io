import React from 'react';
import Button from '@mui/material/Button';
import style from './SignUpButton.module.scss';

interface SignUpButtonProps {
    url?: string;
}

const SignUpButton = ({url}: SignUpButtonProps) => {
    return (
        <div className={style.wrapper}>
            <Button variant="contained" classes={{ root: style.signUpButton }} href={url}>
                Sign Up
            </Button>
        </div>
    );
}

export default SignUpButton;

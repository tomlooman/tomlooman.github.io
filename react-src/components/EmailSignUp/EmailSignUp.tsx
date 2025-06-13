import { TextField } from "@mui/material";
import React, { useState } from "react";
import style from "./EmailSignUp.module.scss";

const EmailSignUp = () => {
    const [email, setEmail] = useState("");

    return (
        <div className={style.emailSignUpBanner}>
            <div className={style.emailSignUpContent}>
                <b>Join thousands of game devs – get regular Unreal Engine insights in your inbox!</b>
                <div className={style.signUpForm}>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={email}
                        placeholder="Enter your email"
                        label="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        classes={{ root: style.textFieldRoot }}
                    />
                    {/* TODO: Change onClick to use a proper email signup function */}
                    <button className={style.signUpButton} onClick={() => console.log(email)}>Sign me up</button>
                </div>
            </div>
        </div>
    );
}

export default EmailSignUp;
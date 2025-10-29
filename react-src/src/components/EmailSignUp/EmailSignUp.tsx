import { TextField } from "@mui/material";
import React, { useState } from "react";
import SingleInputForm from "../Forms/SigleInputForm";
import style from "./EmailSignUp.module.scss";

const EmailSignUp = () => {
    const [email, setEmail] = useState("");

    return (
        <div className={style.emailSignUpBanner}>
            <div className={style.emailSignUpContent}>
                <b>Join thousands of game devs – get regular Unreal Engine insights in your inbox!</b>
                {/* TODO: Change onSubmit to use a proper email signup function */}
                <SingleInputForm placeholder="Enter your email" label="Email" onSubmit={(value) => console.log(value)} submitText="Sign me up" />
            </div>
        </div>
    );
}

export default EmailSignUp;
import { TextField } from "@mui/material";
import React, { useState } from "react";
import SingleInputForm from "../Forms/SigleInputForm";
import style from "./EmailSignUp.module.scss";

const EmailSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitEmail = async (email: string) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("email_address", email);

        await fetch("https://app.kit.com/forms/8905753/subscriptions", {
            method: "POST",
            mode: "no-cors", // important for static sites
            body: formData,
        });

        setLoading(false);
        setSuccess(true);
    };

    return (
        <div className={style.emailSignUpBanner}>
            <div className={style.emailSignUpContent}>
                <b>
                    Join thousands of game developers and get Unreal Engine C++ &
                    Optimization insights in your inbox!
                </b>

                {success ? (
                    <p>Check your email to confirm your subscription.</p>
                ) : (
                    <SingleInputForm
                        placeholder="Enter your email"
                        label="Email"
                        onSubmit={submitEmail}
                        submitText={loading ? "Submitting..." : "Sign me up"}
                    />
                )}
            </div>
        </div>
    );
};


export default EmailSignUp;
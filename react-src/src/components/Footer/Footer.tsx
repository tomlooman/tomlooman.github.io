import React from 'react';
import arrowSvg from '../../../public/assets/triangles_6_non_filled_orange.svg';
import SingleInputForm from '../Forms/SigleInputForm';
import style from './Footer.module.scss';

interface SocialLink {
    label: string;
    icon: string;
    url: string;
}

interface FooterLink {
    label: string;
    url: string;
}

const Footer = () => {
    /*const links: SocialLink[] = [
        { label: "Twitter", icon: "fab fa-x-twitter", url: "https://twitter.com/t_looman" },
        { label: "GitHub", icon: "fab fa-github", url: "https://github.com/tomlooman" },
        { label: "YouTube", icon: "fab fa-youtube-square", url: "https://www.youtube.com/channel/UCnO-xQvmsO1WwKFq-5Pvj0Q" },
        { label: "LinkedIn", icon: "fab fa-linkedin", url: "https://www.linkedin.com/in/tomlooman/" } 
    ];*/

    const links: FooterLink[] = [
        { label: "Courses Login", url: "https://courses.tomlooman.com/sign_in" },
        { label: "GitHub Projects", url: "https://github.com/tomlooman/ActionRoguelike/" },
        { label: "Unreal Engine Training for Studios", url: "/studiotraining" },
        { label: "Contact", url: "/contact" },
        { label: "Terms of Use", url: "https://courses.tomlooman.com/p/terms" },
        { label: "Privacy Policy", url: "https://courses.tomlooman.com/p/privacy" }
    ];

    return (
        <div className={style.footer}>
            <img className={style.topImage} src={arrowSvg} alt="arrow banner" />
            <div className={style.container}>
                <div className={style.links}>
                    {links.map(link => (
                        <a key={link.label} href={link.url}>
                            {link.label}
                        </a>
                    ))}
                </div>
                <div className={style.middle}>
                    <div />
                    <div className={style.image} />
                </div>
                <div className={style.newsLetter}>
                    <h2>Join my Newsletter</h2>
                    <p>Join over 5000 fellow developers and receive Unreal Engine insights in your inbox!</p>
                    {/* TODO: change onSubmit to use a proper email signup function */}
                    <SingleInputForm
                        label="Email address"
                        onSubmit={(value) => console.log(value)}
                        submitText="Subscribe"
                        inputLabelProps={{
                            sx: {
                                '&.Mui-focused': {
                                    display: 'none',
                                },
                            },
                        }}
                        inputProps={{
                            sx: {
                                '&.MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: "transparent",
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Footer;

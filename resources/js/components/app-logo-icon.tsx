import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/skillpilot-logo.png"
            alt="SkillPilot Logo"
            className={`object-contain ${props.className || ''}`}
        />
    );
}

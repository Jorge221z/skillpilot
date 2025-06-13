import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20">
                <div className="relative h-full w-full">
                    <div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 transform rounded-full  blur-md">
                    </div>
                    <AppLogoIcon className="h-full w-full object-cover rounded-full" />
                </div>
            </div>
            <div className=" grid flex-1 text-left">
                <span className="mb-0.5 truncate leading-tight font-bold text-xl">
                    <span className="text-blue-400">Skill</span>
                    <span className="text-orange-500">Pilot</span>
                </span>
            </div>
        </>
    );
}

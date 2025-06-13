import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-16 items-center justify-center">
                <AppLogoIcon className="size-12" />
            </div>
            <div className="-ml-5.5 grid flex-1 text-left">
  <span className="mb-0.5 truncate leading-tight font-bold text-xl">
    <span className="text-blue-400">Skill</span>
    <span className="text-orange-500">Pilot</span>
  </span>
</div>
        </>
    );
}

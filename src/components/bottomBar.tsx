import Image from "next/image"

export const BottomBar = () =>
(
    <div className="flex flex-col space-y-[11px] md:flex-row md:justify-center space-x-[11px]">
        <div
        className={`w-[412px] text-black text-xl font-semibold font-inter leading-normal`}>
            Resolva seus problemas de comunicação:
        </div>
        <div className="flex flex-row justify-center md:center space-x-[26px]">
            <Image alt="email" src="/icons/email-icon.svg" width={38.48} height={34.2}/>
            <Image alt="LinkedIn" src="/icons/linkedin-icon.svg" width={34.21} height={34.21}/>
        </div>
    </div>
);

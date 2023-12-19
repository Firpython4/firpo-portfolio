import Image from "next/image"

export const BottomBar = () =>
(
    <div className="flex flex-col space-y-[11px] items-center md:flex-row md:space-x-[11px]">
        <p className={`w-[412px] text-black flex items-center text-xl font-semibold font-inter leading-normal`}>
            Resolva seus problemas de comunicação:
        </p>
        <div className="h-full">
            <div className=" flex flex-row items-center space-x-[26px]">
                <Image alt="email" src="/icons/email-icon.svg" width={38.48} height={34.2}/>
                <Image alt="LinkedIn" src="/icons/linkedin-icon.svg" width={34.21} height={34.21}/>
            </div>
        </div>
    </div>
);

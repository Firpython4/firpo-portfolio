import ExportedImage from "next-image-export-optimizer";
import Link from "next/link";
import type PropsWithClassName from "../types/propsWithClassName";
import { emailLink, linkedInLink } from "~/config";

const iconSize = `w-[clamp(14px,4vw,34px)]`;

export const NavBar = (
  props: PropsWithClassName<{ iconPaths: { linkedin: string; email: string } }>,
) => {
  return (
    <div
      className={`${props.className} flex flex-row gap-x-[clamp(8px,2vw,26px)]`}
    >
      <Link href={emailLink}>
        <ExportedImage
          unoptimized={true}
          loading="eager"
          alt="email"
          placeholder="empty"
          className={`aspect-[39/34] ${iconSize}`}
          src={props.iconPaths.email}
          width={39}
          height={34}
        />
      </Link>
      <Link href={linkedInLink}>
        <ExportedImage
          unoptimized={true}
          alt="LinkedIn"
          loading="eager"
          placeholder="empty"
          className={`aspect-square ${iconSize}`}
          src={props.iconPaths.linkedin}
          width={34}
          height={34}
        />
      </Link>
    </div>
  );
};

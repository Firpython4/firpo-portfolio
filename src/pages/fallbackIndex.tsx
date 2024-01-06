import type { GetStaticProps } from "next";
import { type PieceType } from "~/types/pieceType";
import {getIndexProps} from "~/index";
import { type Locale } from "~/localization/localization";
import Home from "./[locale]";

const FallbackHome = (props: HomeProps) =>
(
    <Home locale={props.locale} pieces={props.pieces}/>
);

export const getStaticProps = (async () =>
{
    return await getIndexProps("pt-BR");
    
}) satisfies GetStaticProps<HomeProps>

type HomeProps = {
    pieces: PieceType[],
    locale: Locale
}
export default FallbackHome

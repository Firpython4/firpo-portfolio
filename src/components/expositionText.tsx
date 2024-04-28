import {locale} from "~/localization/localization";

export const ExpositionText = () =>
(
    <div
        className="w-full flex flex-col md:flex-row justify-center pt-[118px] gap-[40px] md:gap-[80px] lg:gap-[130] xl:gap-[215px]">
        <div
            className={`w-[434px] h-[535px] text-black text-small not-italic font-semibold leading-[27px] font-inter`}>{locale.expositionFirst}
        </div>
        <div
            className="w-[435px] text-black text-small not-italic font-normal leading-[27px] tracking-[-0.17px] pt-[172px] font-inter"><span
            className="text-black text-small font-semibold leading-relaxed pt-3">{locale.someAttendedClients}<br/></span><span
            className="text-black text-small font-normal leading-relaxed">Grupo Telefónica, Petrobras, Vivo, Grupo Braskem, Edenred, Aegea, Banrisul, Grupo Gerdau, Midea-Carrier, Springer, GRU Airport, Husqvarna, Massey Ferguson, John Deere, Grupo RBS, Zero Hora, Ramarim, Klabin, Sicredi, Abicalçados, Sistema FIERGS, Paquetá, Gaston, Nutrella, Laghetto Hotéis, Piccadilly, Yara, Sescoop, Voopter, Op'n'Go, Vinhos Miolo, Oxiteno, Senac, Fecomércio, SC Internacional, UCS, Correio do Povo, Record, Hospital Moinhos de Vento, Governo do Rio Grande do Sul, Governo de Santa Catarina, Daer, Sulgás, Detran, CEEE, Corsan, Grupo Zaffari, Supermercados Angeloni, Tintas Renner, Sayerlack, Selenium, Cerâmicas Oxford, Student Travel Bureau, Lojas Colombo Stores, Rede de Concessionárias Fiat e as seguintes prefeituras: Porto Alegre, Passo Fundo, Bento Gonçalves, Gravataí, Santa Maria e Rio Grande. </span>
        </div>
    </div>
);

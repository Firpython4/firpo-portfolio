import Document, {
    Html,
    Head,
    Main,
    NextScript,
    type DocumentContext,
} from 'next/document'
import { type Locale, enLocale, ptLocale } from "~/localization/localization";

class MyDocument extends Document<{locale: Locale}> {
    static async getInitialProps(
        ctx: DocumentContext
    ) {
        const initialProps = await Document.getInitialProps(ctx);
        const locale = ctx.asPath?.startsWith(`/${ptLocale}`) ? ptLocale : enLocale;
        return { ...initialProps, locale };
    }
    
    render() {
        return (
            <Html lang={this.props.locale}>
                <Head />
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument

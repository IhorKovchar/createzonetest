import { ProviderAuth } from "@/components/providers/providers";
import Header from "../components/header";
import "@/styles/global.scss"
import { Montserrat } from "next/font/google"
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { DEFAULT_THEME, isValidTheme, Theme } from "@/lib/theme/theme";
import { ThemeProvider } from "@/context/themeContext";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/footer";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["500"],
    variable: "--font-montserrat",
})

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    const session = await auth()
    const cookie = await cookies()
    const cookieTheme = cookie.get("theme")?.value

    let theme: Theme = DEFAULT_THEME;

    if(session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: {id: Number(session.user.id)},
            select: {theme: true}
        });
        theme = isValidTheme(user?.theme) ? user?.theme : DEFAULT_THEME
    } else {
        theme = isValidTheme(cookieTheme) ? cookieTheme : DEFAULT_THEME
    }

    return (
        <html data-theme={theme} suppressHydrationWarning>
            <body className={montserrat.variable}>
                <ThemeProvider initialTheme={theme}>
                    <ProviderAuth>
                        <div className="layout">
                            <Header session={session}/>
                            <main className="main">
                                {children}
                            </main>
                            <Footer/>
                        </div>
                    </ProviderAuth>
                </ThemeProvider>
            </body>
        </html>
    )

}
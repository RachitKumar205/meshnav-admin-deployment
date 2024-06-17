import type { Metadata } from "next";
import {Inter, Montserrat} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({subsets: ['latin']});

export const metadata: Metadata = {
    title: "mesh.nav Analytics Platform",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${montserrat.className} dark`}>
        <main>
        <div className={"h-16 bg-zinc-950 border-b border-gray-700 flex items-center px-10"}>
            <p className={'text-4xl text-white absolute'}>
                mesh.<span className={'text-purple-500'}>nav</span>
            </p>
            <div className={'h-full items-center flex w-full justify-center space-x-8'}>
                <Link href={'/'} className={'hover:underline hover:text-white text-md text-gray-400'}>Waypoints</Link>
                <Link href={'/network'} className={'hover:underline hover:text-white text-md text-gray-400'}>Network</Link>
                <Link href={'/create_edge'} className={'hover:underline hover:text-white text-md text-gray-400'}>Add Edges</Link>
            </div>
        </div>
        {children}
        </main>
        <Toaster />
        </body>
        </html>
    );
}

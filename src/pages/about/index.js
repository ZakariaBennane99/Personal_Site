import LeftSection from '@/components/leftSection'
import Image from 'next/image'
import Head from 'next/head'

export default function AboutPage() {
    return (
        <>
        <Head>
            <title>A Little About Me</title>
            <meta name="description" content='A Short Introduction About Zakaria Bennane' />
        </Head>
        <div style={{ overflow: 'hidden' }}>
            <LeftSection type={2}/>
            <main className='about-page'>
                <Image src='/me.png' alt='Zakaria Bennane Portrait' width={180} height={180} style={{
                    boxShadow: '0px 0px 6px 0px rgb(174, 174, 174)',
                    borderRadius: '9px'
                 }} />
                <div className='about-container'>
                    <div>
                        <h1>In Short</h1>
                        <p>
                            A Cat Lover 😺 | Nature Person 🍃 | HSP 🐼 | Global Citizen 🌎 | maker 🧑‍💻 | Introvert 😶
                        </p>
                    </div>
                    <div style={{ marginBottom: '5px' }} className='details-wrapper'>
                        <h1>Some Details</h1>
                        <p>Hi! I’m Zakaria Bennane. I was born in <a href='https://en.wikipedia.org/wiki/Casablanca' target='_blank' rel='noreferrer'>this</a> city during
                            the dot com bubble. I worked in a variety of jobs, from sewing
                            beds at Souk “Al Qurayaa” in my native city at 9
                            to varnishing wood at my uncle’s workshop. Currently, I’m
                            studying for a BBA, writing about marketing, and making stuff.</p>
                        <p>I recently discovered that I’m an HSP -- Highly Sensitive Person.
                            The more I read and learn, the more I became aware of myself.
                            I’m already an Assertive Defender (you can read about it <a href='https://www.16personalities.com/profiles/39fcc76411111' target='_blank' rel='noreferrer'>here</a>),
                            and I know I have an unsatiable appetite for new experiences
                            and challenges. Now, I’m trying to further discover myself by
                            connecting to other people, offering value through my projects,
                            and taking up some crazy challenges.</p>
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <h1>Connect</h1>
                        <a href='https://www.linkedin.com/in/zakaria-bennane-%F0%9F%98%BA-6b789423a/'>
                        <Image src='./link.svg' alt='linkedIn logo' width={40} height={40} /></a>
                        <a href='https://twitter.com/zakaria_bennane'>
                        <Image src='./twit.svg' alt='twitter logo' width={40} height={40} /></a>
                        <a href='https://github.com/ZakariaBennane99?tab=overview&from=2023-01-01&to=2023-01-28'>
                        <Image src='./gh.svg' alt='GitHub logo' width={40} height={40} /></a>
                        <a href='https://stackoverflow.com/users/16556467/zakaria-bennane'>
                        <Image src='./sof.svg' alt='Stackoverflow logo' width={40} height={40} /></a>
                        <a href='mailto: contact@zakariabennane.com'>
                        <Image src='./email.svg' alt='email logo' width={40} height={40} /></a>
                    </div>
                </div>
            </main>
        </div>
        </>
    )
}

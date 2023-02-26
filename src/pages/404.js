
export default function Custom404() {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Ubuntu'
     }}>
        <img src='/p404.svg' alt='404 error page' width='50%' />
        <h1>Page Not Found</h1>
        <p>Artwork by <a href='https://www.freepik.com/author/stories'>@StorySet</a></p>
    </div>
}

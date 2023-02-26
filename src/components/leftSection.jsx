import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useLayoutEffect } from 'react'


export default function LeftSection ({ type }) {

  const [width, setWidth] = useState()

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [obj, setObj] = useState(() => {
    const arr = [false, false, false]
    arr[type] = true
    return arr
  })

  function handleUnderline (e) {
    setObj(() => {
      if (e.target.id === '0') {
        return [true, false, false]
      } else if (e.target.id === '1') {
        return [false, true, false]
      } else {
        return [false, false, true]
      }
    })
  }

  const thisYear = new Date().getFullYear()

  return ( width < 1154 ?
      <section className='left-section' >
        <img src='/mobileLogo.svg' alt="logo zakaria bennane" />
        <nav className='menu-holder'>
          <Link href={{ pathname: '/blog' }} style={{ all: 'unset' }}>
            <img src='/blogIcon.svg' alt="blog icon" />
          </Link>
          <Link href={{ pathname: '/projects' }} style={{ all: 'unset' }}>
            <img src='/projectsIcon.svg' alt="projects icon" />
          </Link>
          <Link href={{ pathname: '/about' }} style={{ all: 'unset' }}>
            <img src='/aboutIcon.svg' alt="about icon" />
          </Link>
        </nav>
        <footer className='footer-section'>
          <h1>Made With NextJS</h1>
          <p>Copyright &#169; {`${thisYear}`}</p>
        </footer>
      </section>
   :
      <section className='left-section' style={{ left: width > 1499 ? `${(width - 1499)/2}px` : '0px', width: width > 1499 ? `350px` : '20%', padding: width > 1499 ? '3rem' : '3%' }}>
          <div style={{ width: '15rem', height: `3.54rem`, position: 'relative', overflow: 'hidden' }} >
              <Image src='/logo.svg' alt="logo-zakaria-bennane" fill />
          </div>
          <nav className='menu-holder'>
              <div className='blog-underline'>
                <Link href={{ pathname: '/blog' }} style={{ all: 'unset' }}>
                  <h1 onClick={handleUnderline} id='0'>Blog</h1>
                </Link>
                <img src='/BlogUnderline.svg' alt="blog-underline" style={{ filter: obj[0] ? 'invert(100%) sepia(1%) saturate(3776%) hue-rotate(184deg) brightness(109%) contrast(100%)' : '' }} />
              </div>
              <div className='projects-underline'>
                <Link href={{ pathname: '/projects' }} style={{ all: 'unset' }}>
                  <h1 onClick={handleUnderline} id='1'>Projects</h1>
                </Link>
                <img src='/projectsUnderline.svg' alt='projects-underline' style={{ filter: obj[1] ? 'invert(100%) sepia(1%) saturate(3776%) hue-rotate(184deg) brightness(109%) contrast(100%)' : '' }} />
              </div>
              <div className='about-underline'>
                <Link href={{ pathname: '/about' }} style={{ all: 'unset' }}>
                  <h1 onClick={handleUnderline} id='2'>About</h1>
                </Link>
                <img src='/aboutUnderline.svg' alt='about-underline' style={{ filter: obj[2] ? 'invert(100%) sepia(1%) saturate(3776%) hue-rotate(184deg) brightness(109%) contrast(100%)' : '' }} />
              </div>
          </nav>
          <footer className='footer-section'>
            <h1>Made With NextJS</h1>
            <p>Copyright &#169; {`${thisYear}`}</p>
          </footer>
      </section>
  )
}

// Notion SDK
const { Client } = require('@notionhq/client')
// Notion to MD Package
const { NotionToMarkdown } = require("notion-to-md")
// MD to html (not parsed)
const { marked } = require('marked')
const connectDB = require('../../config/db')
const Post = require('../../models/Post')
// reading time package
const readingTime = require('reading-time')

import Head from 'next/head'
import LeftSection from '@/components/leftSection'
import javascript from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import hljs from 'highlight.js'
import { useEffect } from 'react'
import 'highlight.js/styles/default.css'
import Image from 'next/image'



hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('css', css)


function ThePost({ serialized }) {

  const deSerialized = JSON.parse(serialized)

  function toSlug(title){
    const lowerCase = title.toLowerCase()
    return lowerCase.split(" ").join("-")
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    hljs.initHighlighting()
  }, [])

  const pageUrl = 'https://zakariabennane.com/' + toSlug(deSerialized.title)

  return (
    <>
      <Head>
        <title>{deSerialized.title}</title>
        <meta name="description" content={deSerialized.title} />
        <meta name="author" content="Zakaria Bennane" />
        <meta property="og:title" content={deSerialized.title} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={deSerialized.featuredImg.url} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={deSerialized.title} />
        <meta property="og:locale" content="en_US" />
      </Head>
      <LeftSection type={0} />
      <div className='the-post-container' >
        <div>
          <h1>{deSerialized.title}</h1>
        </div>
        <div>
          <p>📅 {deSerialized.date}</p>
          <p>⏳ {deSerialized.readingTime}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: deSerialized.content.replace(/(?<=\<p\>).+?(?=\<\/p>)/, "") }}></div>
      </div>
    </>
  )
}

// This function gets called at build time
export async function getStaticPaths() {

  function toSlug(title){
    const lowerCase = title.toLowerCase()
    return lowerCase.split(" ").join("-")
  }

  const notion = new Client({ auth: process.env.NOTION_API_TOKEN })

  // passing notion client to the option
  const n2m = new NotionToMarkdown({ notionClient: notion })

  // all the articles in the form of an array
  const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_BLOG_PAGE_ID)

  // Get the paths we want to pre-render based on posts
  const paths = mdblocks.map((elem) => ({
    params: { id: toSlug(elem.parent.match(/(?<=\[).+?(?=\])/)[0])},
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {

  // connect the DB
  connectDB()
  function unSlug(title){
    const spaced = title.split("-").join(" ")
    return spaced.replace(/\b./g, function(m){ return m.toUpperCase() })
  }


  const postDB = await Post.findOne({ title: unSlug(params.id) })

  console.log(postDB)
  const serialized = JSON.stringify(postDB)


  // Pass post data to the page via props
  return { props: { serialized } }
}

export default ThePost

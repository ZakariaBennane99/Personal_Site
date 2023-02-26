// Notion SDK
const { Client } = require('@notionhq/client')
// Notion to MD Package
const { NotionToMarkdown } = require("notion-to-md")
const Project = require('../../models/Project')
const { marked } = require('marked')
const connectDB = require('../../config/db')
import Head from 'next/head'
import LeftSection from '@/components/leftSection'


function TheProject({ serialized }) {
  const deSerialized = JSON.parse(serialized)
  return (
    <>
      <Head>
        <title>{deSerialized.title}</title>
        <meta name="description" content={deSerialized.title} />
        <meta name="author" content="Zakaria Bennane" />
      </Head>
      <LeftSection type={1} />
      <div className='the-project-container' >
        <div>
          <h1>{deSerialized.title}</h1>
        </div>
        <div dangerouslySetInnerHTML={{ __html: deSerialized.content }}></div>
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
  const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_PROJECTS_PAGE_ID)

  // Get the paths we want to pre-render based on projects
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

  const projectDB = await Project.findOne({ title: unSlug(params.id) })

  const serialized = JSON.stringify(projectDB)

  // Pass project data to the page via props
  return { props: { serialized } }
}

export default TheProject

// Notion SDK
const { Client } = require('@notionhq/client')
// Notion to MD Package
const { NotionToMarkdown } = require("notion-to-md")
// MD to html (not parsed)
const { marked } = require('marked')
const cloudinary = require('cloudinary').v2
const connectDB = require('../../config/db')
const Project = require('../../models/Project')
// NextJS Link
import Link from 'next/link'
// NextJS Image
import Image from 'next/image'
import LeftSection from '@/components/leftSection'
import Head from 'next/head'


export default function ProjectsList({ projectsSerialized }) {

  const deSerializedProjects = JSON.parse(projectsSerialized)

  function toSlug(title){
    console.log(title)
    const lowerCase = title.toLowerCase()
    return lowerCase.split(" ").join("-")
  }


  return (
    <>
    <Head>
      <title>A List of Projects I Made</title>
      <meta name="description" content='A List of Projects Made By Zakaria Bennane' />
    </Head>
    <LeftSection type={1} />
    <main className='blog-list-container' >
      {deSerializedProjects.map(project => {
        return (
            <div key={project.key} className='project-info-container' >
              <Link
                href={{
                  pathname: `projects/${toSlug(project.title)}`
                }}
                style={{
                    all:'unset',
                    cursor: 'pointer'
                 }}>
                  <Image src={project.featuredImg.url}
                    alt={project.featuredImg.alt} fill style={{ objectFit: 'cover', borderRadius: '9px' }}/>
                    <div className='shadow-container'></div>
                    <div className='modal-container'>
                        <h1>{project.title}</h1>
                    </div>
              </Link>
            </div>)
      })}
    </main>
    </>
  )
}



export const getStaticProps = async () => {

  // connect the DB
  connectDB()

  // Configuration
  cloudinary.config({
    cloud_name: "proderto",
    api_key: "814183344722769",
    api_secret: "qHUfL0sXK9U60OG6MlyvkARcYJ4"
  })

  const notion = new Client({ auth: process.env.NOTION_API_TOKEN })

  // passing notion client to the option
  const n2m = new NotionToMarkdown({ notionClient: notion })

  async function toCloudinary(url, alt) {
    try {
      const res = cloudinary.uploader.upload(url,
        { public_id: "my-personal-site/" + alt })
      const data = await res
      return data.secure_url
    } catch (err) {
      console.log(err)
    }
  }

  async function replaceAsync(str) {
    const promises = []
    str.replaceAll(/<img\s.+?>/g, (matched) => {
        const imgInfo = matched.match(/(?<=\<img\s).+?(?=\>)/)[0]
        const theAlt = imgInfo.match(/(?<=alt=").+?(?=")/)[0]
        const promise = toCloudinary(imgInfo.match(/(?<=src=").+?(?=")/)[0], theAlt)
        promises.push(promise)
    })
    const data = await Promise.all(promises)
    return data
  }

  const projects = async function getAllProjects() {
    // will get all projects from MongoDB
    const projects1 = await Project.find().select('key title featuredImg')
    if (projects1.length === 0) {
      let i = -1
      const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_PROJECTS_PAGE_ID)
      const projects = Promise.all(mdblocks.map(async (elem) => {
        const title = elem.parent.match(/(?<=\[).+?(?=\])/)[0]
        const id = elem.parent.match(/(?<=\().+?(?=\))/)[0]
        const body = n2m.toMarkdownString(elem.children)
        const parsedBody = marked.parse(body)
        const urls = await replaceAsync(parsedBody)
        const fBody = parsedBody.replaceAll(/<img\s.+?>/g, function (matched) {
          const imgInfo = matched.match(/(?<=\<img\s).+?(?=\>)/)[0]
          const theAlt = imgInfo.match(/(?<=alt=").+?(?=")/)[0]
          i++
          return '<Image ' + 'src=' + `"${urls[i]}"` + ' alt=' + `"${theAlt}"` + ' >'
        })

        const fImg = {
          url: fBody.match(/(?<=<p><Image\ssrc=").+?(?=")/i)[0],
          alt: fBody.match(/(?<=\salt=").+?(?=")/)[0]
        }

        // save to MDB
        let projectFields = {
          key: id,
          title: title,
          featuredImg: fImg,
          content: fBody
        }

        let project = new Project(projectFields)
        await project.save()

        return {
          key: id,
          title: title,
          featuredImg: fImg
        }

      }))
      return projects
    } else {
      const projectsIds = await Project.find().select('key')
      const projectIdsAr = projectsIds.map(el => el.key)
      const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_PROJECTS_PAGE_ID)
      const projects2 = Promise.all(mdblocks.map(async (elem) => {
        let x = -1
        const id = elem.parent.match(/(?<=\().+?(?=\))/)[0]
        if (!projectIdsAr.includes(id)) {
          const title = elem.parent.match(/(?<=\[).+?(?=\])/)[0]
          const body = n2m.toMarkdownString(elem.children)
          const parsedBody = marked.parse(body)
          const urls = await replaceAsync(parsedBody)
          const fBody = parsedBody.replaceAll(/<img\s.+?>/g, function (matched) {
          const imgInfo = matched.match(/(?<=\<img\s).+?(?=\>)/)[0]
          const theAlt = imgInfo.match(/(?<=alt=").+?(?=")/)[0]
            x++
            return '<Image ' + 'src=' + `"${urls[i]}"` + ' alt=' + `"${theAlt}"` + ' >'
          })

        const fImg = {
          url: fBody.match(/(?<=<p><Image\ssrc=").+?(?=")/i)[0],
          alt: fBody.match(/(?<=\salt=").+?(?=")/)[0]
        }

        // save to MDB
        let projectFields = {
          key: id,
          title: title,
          featuredImg: fImg,
          content: fBody
        }

        let project = new Project(projectFields)
        await project.save()

        return {
          key: id,
          title: title,
          featuredImg: fImg
        }

        } else {
          return ''
        }
      }))
      const re = await projects2
      return [...re.filter(el => el), ...projects1]
    }
  }

  const projectsReady = await projects()
  const projectsSerialized = JSON.stringify(projectsReady)

  return {
    props: {
      projectsSerialized
    }
  }

}

// Notion SDK
const { Client } = require('@notionhq/client')
// Notion to MD Package
const { NotionToMarkdown } = require("notion-to-md")
// reading time package
const readingTime = require('reading-time')
const cloudinary = require('cloudinary').v2
const connectDB = require('../../config/db')
const Post = require('../../models/Post')
const { marked } = require('marked')
// NextJS Link
import Link from 'next/link'
// NextJS Image
import Image from 'next/image'
import Head from 'next/head'
import LeftSection from '@/components/leftSection'




export default function blogList({ postsSerialized }) {

  const deSerialized = JSON.parse(postsSerialized)


  function toSlug(title){
    const lowerCase = title.toLowerCase()
    return lowerCase.split(" ").join("-")
  }


  return (
    <>
    <Head>
      <title>Wording My Thoughts and Learnings</title>
      <meta name="description" content='Sharing What I learn' />
    </Head>
    <LeftSection type={0} />
    <main className='blog-list-container' >
      {deSerialized.map(elem => {
        return (
            <div key={elem.key} className='blog-info-container'>
              <Link
                href={{
                  pathname: `blog/${toSlug(elem.title)}`
                }}
                >
                <div style={{ width: '100%', height: '55%', position: 'relative', borderTopRightRadius: '9px', borderTopLeftRadius: '9px'}}>
                  <Image src={elem.featuredImg.url}
                    alt={elem.featuredImg.alt} fill style={{ objectFit: 'cover' }} />
                </div>
              </Link>
              <div className='txt-part'>
                <Link
                  href={{
                    pathname: `blog/${toSlug(elem.title)}`
                  }}
                  style={{ all: 'unset', cursor: 'pointer' }}>
                    <h1>{elem.title}</h1>
                </Link>
                <div>📅 {elem.date}</div>
                <div>⏳ {elem.readingTime}</div>
              </div>
            </div>)
      })}
    </main>
    </>
  )
}



export const getStaticProps = async () => {

  function getMonthNum(st) {
    const m = {
      'Jan': 0,
      'Feb': 1,
      'Mar': 2,
      'Apr': 3,
      'May': 4,
      'Jun': 5,
      'Jul': 6,
      'Aug': 7,
      'Sep': 8,
      'Oct': 9,
      'Nov': 10,
      'Dec': 11,
    }
    return m[st]
  }

  // connect the DB
  connectDB()

  // Configuration
  cloudinary.config({
    cloud_name: "proderto",
    api_key: "814183344722769",
    api_secret: process.env.CLOUDINARY_SECRET
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

  const posts = async function getAllPosts() {
    function formatReadingTime(t) {
      const s = t.split(" ")
      return s[0] + " " + s[1].charAt(0).toUpperCase() + s[1].substr(1,) + " " + s[2].charAt(0).toUpperCase() + s[2].substr(1,)
    }
    // will get all posts from MongoDB
    const posts1 = await Post.find()
    if (posts1.length === 0) {
      const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_BLOG_PAGE_ID)
      const posts = Promise.all(mdblocks.map(async (elem) => {
        let i = -1
        const title = elem.parent.match(/(?<=\[).+?(?=\])/)[0]
        const id = elem.parent.match(/(?<=\().+?(?=\))/)[0]
        const body = n2m.toMarkdownString(elem.children)
        const readTime = readingTime(body)
        const date = body.match(/.+?(?=date)/)[0]
        const parsedBody = marked.parse(body)
        const urls = await replaceAsync(parsedBody)

        const fBody = parsedBody.replaceAll(/<img\s.+?>/g, function (matched) {
          const imgInfo = matched.match(/(?<=\<img\s).+?(?=\>)/)[0]
          const theAlt = imgInfo.match(/(?<=alt=").+?(?=")/)[0]
          i++
          return '<Image ' + 'src=' + `"${urls[i]}"` + ' alt=' + `"${theAlt}"` + ' >'
        })
        console.log('theis is the body', fBody)
        const fImg = {
          url: fBody.match(/(?<=<p><Image\ssrc=").+?(?=")/i)[0],
          alt: fBody.match(/(?<=\salt=").+?(?=")/)[0]
        }

        // save to MDB
        let postFields = {
          key: id,
          title: title,
          date: date,
          readingTime: formatReadingTime(readTime.text),
          featuredImg: fImg,
          content: fBody
        }

        let post = new Post(postFields)
        await post.save()

        return {
          key: id,
          title: title,
          date: date,
          readingTime: formatReadingTime(readTime.text),
          featuredImg: fImg,
          content: fBody
        }

      }))
      return posts
    } else {
      const postsIds = await Post.find().select('key')
      const postIdsAr = postsIds.map(el => el.key)
      const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_BLOG_PAGE_ID)
      const posts2 = Promise.all(mdblocks.map(async (elem) => {
        const id = elem.parent.match(/(?<=\().+?(?=\))/)[0]
        if (!postIdsAr.includes(id)) {
          let i = -1
          const title = elem.parent.match(/(?<=\[).+?(?=\])/)[0]
          const body = n2m.toMarkdownString(elem.children)
          const readTime = readingTime(body)
          const date = body.match(/.+?(?=date)/)[0]
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
        let postFields = {
          key: id,
          title: title,
          date: date,
          readingTime: formatReadingTime(readTime.text),
          featuredImg: fImg,
          content: fBody
        }

        let post = new Post(postFields)
        await post.save()

        return {
          key: id,
          title: title,
          date: date,
          readingTime: formatReadingTime(readTime.text),
          featuredImg: fImg,
          content: fBody
        }

        } else {
          return ''
        }
      }))
      const r = await posts2
      return [...r.filter(el => el), ...posts1]
    }
  }

  const postsReady = await posts()
  const orderedPosts = postsReady.sort((a, b) => {
    const age = a.date.split(' ')
    const am = getMonthNum(age[0])
    const ad = parseInt(age[1].slice(0, -1))
    const ay = parseInt(age[2])
    const bge = b.date.split(' ')
    const bm = getMonthNum(bge[0])
    const bd = parseInt(bge[1].slice(0, -1))
    const by = parseInt(bge[2])
    if (ay < by || ay === by && am < bm || ay === by && am === bm && ad <= bd) {
      return 1
    } else {
      return -1
    }
  })
  const postsSerialized = JSON.stringify(orderedPosts)

  return {
    props: {
      postsSerialized
    }
  }

}

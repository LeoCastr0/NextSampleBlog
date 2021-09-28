import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postDirectory)
  const allPostsData = fileNames.map((fileName) => {
    //remover ".md" from file name to get id
    const id = fileName.replace(/\.md$/,"")

    //Read markdown as string
    const fullPath = path.join(postDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    return {
      id, 
      ...(matterResult.data as {data: string; title:string}),

    }
  })

  return allPostsData.sort((a, b) => {
    if(a.data < b.data) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostsIds() {
  const fileNames = fs.readdirSync(postDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
  const fullPath = path.join(postDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  //use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  //use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  //combine the data whit id
  return {
    id,
    contentHtml,
    ...(matterResult.data as {date: string, title: string})
  }
}

//pegando dados de uma API
// export async function getSortedPostsData() {
//   const res = await fetch('https://api.publicapis.org/entries',{ method: 'get'}).then((res) => res.json())
//   return {
//     props: {
//       allPostsData: res,
//     }
//   }
// }


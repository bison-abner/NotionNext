// import BLOG from '@/blog.config'
// import { siteConfig } from '@/lib/config'
// import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
// import { DynamicLayout } from '@/themes/theme'

// export async function getStaticPaths() {
//   const { allPages } = await getGlobalData({ from: 'slug-paths' })
//   const paths = allPages
//     ?.filter(page => page?.slug && page?.status === 'Published')
//     ?.map(page => ({
//       params: { slug: page.slug }
//     }))

//   return {
//     paths,
//     fallback: true
//   }
// }

// export async function getStaticProps({ params: { slug }, locale }) {
//   const from = `slug-${slug}`
//   const props = await getGlobalData({ from, locale })
//   const { allPages = [] } = props

//   const post = allPages.find(p => p.slug === slug)
//   if (!post) {
//     return { notFound: true }
//   }

//   const blockMap = await getPostBlocks(post.id, 'page')

//   return {
//     props: {
//       ...props,
//       post,
//       blockMap
//     },
//     revalidate: siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND)
//   }
// }

// export default function ArticlePage(props) {
//   const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
//   return <DynamicLayout {...props} layoutName='LayoutPost' theme={theme} />
// }
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 构建文章详情页的路径
 */
export async function getStaticPaths() {
  const { allPages = [] } = await getGlobalData({ from: 'slug-paths' })
  console.log('[build-log] Total pages fetched from Notion:', allPages.length)

  const paths = allPages
    .filter(page => {
      // Debug：打印每篇文章的状态和 slug
      console.log(`[page] id=${page.id}, slug=${page?.slug}, status=${page?.status}`)

      // 容错：如果没有 slug，用 ID 替代
      if (!page.slug) page.slug = page.id

      // 容错：不同版本可能 status 是 'Published'、'published'、'PUBLISHED'
      const normalizedStatus = String(page.status || '').toLowerCase()
      return normalizedStatus === 'published'
    })
    .map(page => ({
      params: { slug: page.slug }
    }))

  console.log('[build-log] Static paths generated:', paths.length, paths)

  return {
    paths,
    fallback: true // 开启增量构建
  }
}

/**
 * 根据 slug 获取对应文章内容
 */
export async function getStaticProps({ params: { slug }, locale }) {
  const from = `slug-${slug}`
  const props = await getGlobalData({ from, locale })
  const { allPages = [] } = props

  const post = allPages.find(p => p.slug === slug || p.id === slug)
  if (!post) {
    console.warn(`[warn] No post found for slug: ${slug}`)
    return { notFound: true }
  }

  const blockMap = await getPostBlocks(post.id, 'page')

  return {
    props: {
      ...props,
      post,
      blockMap
    },
    revalidate: siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND)
  }
}

/**
 * 渲染文章页面
 */
export default function ArticlePage(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout {...props} layoutName='LayoutPost' theme={theme} />
}

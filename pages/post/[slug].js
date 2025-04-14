import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

export async function getStaticPaths() {
  const { allPages } = await getGlobalData({ from: 'slug-paths' })
  const paths = allPages
    ?.filter(page => page?.slug && page?.status === 'Published')
    ?.map(page => ({
      params: { slug: page.slug }
    }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params: { slug }, locale }) {
  const from = `slug-${slug}`
  const props = await getGlobalData({ from, locale })
  const { allPages = [] } = props

  const post = allPages.find(p => p.slug === slug)
  if (!post) {
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

export default function ArticlePage(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout {...props} layoutName='LayoutPost' theme={theme} />
}

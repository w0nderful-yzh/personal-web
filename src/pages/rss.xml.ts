import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import { visible } from '../utils/content';

export async function GET(context: APIContext) {
  const posts = visible(await getCollection('blog')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: `${profile.name} Blog`,
    description: profile.intro,
    site: context.site ?? profile.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}`,
    })),
  });
}

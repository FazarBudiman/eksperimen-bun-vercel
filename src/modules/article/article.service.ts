import { supabasePool } from '../../supabase/supabasePool'
import { ArticleProps } from './article.model'

export class ArticleService {
  static async extractArticleMeta(blocks: any[]) {
    let title: string | null = null
    let coverUrl: string | null = null

    for (const block of blocks) {
      if (!title && block.type === 'header') {
        title = block.data.text
      }

      if (!coverUrl && block.type === 'image') {
        coverUrl = block.data?.file?.url
      }

      if (title && coverUrl) break
    }

    if (!title) {
      throw new Error('Artikel harus memiliki minimal 1 header sebagai judul')
    }

    if (!coverUrl) {
      throw new Error('Artikel harus memiliki minimal 1 gambar sebagai cover')
    }

    return { title, coverUrl }
  }

  static async addArticle(
    pageId: string,
    payload: ArticleProps,
    contentTeks: string,
    userWhoCreated: string,
    title: string,
    coverUrl: string
  ) {
    const { rows } = await supabasePool.query(
      `INSERT INTO articles (article_page_id, article_title, 
        article_cover_url, article_content_text, 
        article_content_blocks, created_by)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING article_id`,
      [
        pageId,
        title,
        coverUrl,
        contentTeks,
        JSON.stringify(payload.contentBlocks),
        userWhoCreated,
      ]
    )
    return rows[0]
  }
}

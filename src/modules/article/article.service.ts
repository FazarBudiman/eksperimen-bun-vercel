import { ResourceNotFoundError } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { ArticleProps, UpdateArticleServiceProps } from './article.model'

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

  static async getAllArticle() {
    const { rows } = await supabasePool.query(
      `SELECT 
        article_id, article_title, article_cover_url, 
        article_content_text, article_status
      FROM articles 
      WHERE is_deleted = FALSE
        `
    )
    return rows
  }

  static async verifyArticleIsExist(articleId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM articles WHERE article_id = $1 AND is_deleted = FALSE`,
      [articleId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource article tidak ditemukan')
    }
  }

  static async getArticleById(articleId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        a.article_id, a.article_title, 
        a.article_cover_url, a.article_content_blocks, 
        a.article_content_text, a.article_status, 
        a.created_date, u.full_name
      FROM articles a  JOIN users u ON a.created_by = u.user_id
      WHERE a.article_id = = $1`,
      [articleId]
    )
    return rows[0]
  }

  static async updateArticle(
    articleId: string,
    payload: UpdateArticleServiceProps,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.title) {
      fields.push(`article_title = $${idx++}`)
      values.push(payload.title)
    }

    if (payload.coverUrl) {
      fields.push(`article_cover_url = $${idx++}`)
      values.push(payload.coverUrl)
    }

    if (payload.contentText) {
      fields.push(`article_content_text = $${idx++}`)
      values.push(payload.contentText)
    }

    if (payload.contentBlocks) {
      fields.push(`article_content_blocks = $${idx++}`)
      values.push(JSON.stringify(payload.contentBlocks))
    }

    if (payload.status) {
      fields.push(`article_status = $${idx++}`)
      values.push(payload.status)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(articleId)

    const { rows } = await supabasePool.query(
      `UPDATE articles
      SET ${fields.join(', ')}
      WHERE article_id = $${idx}
      RETURNING article_title`,
      values
    )
    return rows[0]
  }

  static async deleteArticle(articleId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE articles 
      SET is_deleted = TRUE 
      WHERE article_id = $1 
      RETURNING article_title`,
      [articleId]
    )
    return rows[0]
  }
}

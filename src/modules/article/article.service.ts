import { ResourceNotFoundError } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import {
  ArticleProps,
  QueryArticleStatusProps,
  UpdateArticleServiceProps,
} from './article.model'

export class ArticleService {
  static async extractArticleMeta(blocks: any[]) {
    let title: string | null = null

    for (const block of blocks) {
      if (!title && block.type === 'header') {
        title = block.data.text
      }
    }

    if (!title) {
      throw new Error('Artikel harus memiliki minimal 1 header sebagai judul')
    }
    return { title }
  }

  static async addArticle(
    pageId: string,
    payload: ArticleProps,
    contentTeks: string,
    userWhoCreated: string,
    title: string
  ) {
    const { rows } = await supabasePool.query(
      `INSERT INTO articles (article_page_id, article_title, 
         article_content_text, article_content_blocks, created_by)
        VALUES ($1, $2, $3, $4, $5) RETURNING article_id`,
      [
        pageId,
        title,
        contentTeks,
        JSON.stringify(payload.contentBlocks),
        userWhoCreated,
      ]
    )
    return rows[0]
  }

  static async getAllArticle(query: QueryArticleStatusProps) {
    const conditions: string[] = ['a.is_deleted = FALSE']
    const values: any[] = []
    let idx = 1

    const { status } = query

    if (status) {
      conditions.push(`a.article_status =  $${idx}`)
      values.push(status.toUpperCase())
    }
    const { rows } = await supabasePool.query(
      `SELECT 
        a.article_id, a.article_title, 
        a.article_content_text, a.article_content_blocks, 
        a.article_cover_url, a.article_cover_description,
        a.article_status, a.created_date, u.full_name as author
      FROM articles a  JOIN users u ON a.created_by = u.user_id
      WHERE ${conditions.join(' AND ')}`,
      values
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
        a.article_cover_url, a.article_cover_description, 
        a.article_content_blocks, a.article_content_text, 
        a.article_status, a.created_date, u.full_name as author
      FROM articles a  JOIN users u ON a.created_by = u.user_id
      WHERE a.article_id = $1 AND a.is_deleted = FALSE`,
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

  static async addCoverArticle(
    articleId: string,
    coverImage: string,
    coverDescription: string
  ) {
    const { rows } = await supabasePool.query(
      `UPDATE articles SET article_cover_url = $1, article_cover_description = $2
        WHERE article_id = $3 RETURNING article_title`,
      [coverImage, coverDescription, articleId]
    )
    return rows[0]
  }

  static async updateCoverArticle(
    articleId: string,
    coverDescription: string | undefined,
    coverImage: string | null,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (coverDescription !== undefined) {
      fields.push(`article_cover_description = $${idx++}`)
      values.push(coverDescription)
    }

    if (coverImage !== null) {
      fields.push(`article_cover_url = $${idx++}`)
      values.push(coverImage)
    }
    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(articleId)

    const { rows } = await supabasePool.query(
      `UPDATE articles SET ${fields.join(', ')}
        WHERE article_id = $${idx} RETURNING article_title`,
      values
    )
    return rows[0]
  }
}

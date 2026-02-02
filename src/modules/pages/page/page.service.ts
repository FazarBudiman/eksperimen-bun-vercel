import { ResourceNotFoundError } from '../../../exceptions/client.error'
import { supabasePool } from '../../../supabase/supabasePool'

export class PageService {
  static async getParentPageId(pageTitle: string) {
    const { rows } = await supabasePool.query(
      `SELECT page_id FROM pages 
      WHERE page_title = $1`,
      [pageTitle]
    )

    if (rows.length === 0) {
      throw new ResourceNotFoundError(
        `Halaman: '${pageTitle}' bukan merupakan parent page`
      )
    }
    return rows[0].page_id
  }
  static async addPage(
    pageTitle: string,
    parentPageId: string | null,
    pageSlug: string,
    userWhoCreated: string
  ) {
    const { rows } = await supabasePool.query(
      `INSERT INTO pages (
        page_title, parent_page_id, page_slug, created_by)
      VALUES($1, $2, $3, $4) RETURNING page_id`,
      [pageTitle, parentPageId, pageSlug, userWhoCreated]
    )
    return rows[0]
  }

  static async getAllPages() {
    const { rows } = await supabasePool.query(
      `SELECT page_id, page_title, page_slug FROM pages
        WHERE is_deleted = FALSE`
    )
    return rows
  }

  static async verifyPageIsExist(pageId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM pages WHERE page_id = $1 AND is_deleted = FALSE`,
      [pageId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource page tidak ditemukan')
    }
  }

  static async getPageById(pageId: string) {
    const { rows } = await supabasePool.query(
      `SELECT page_id, page_title, page_slug FROM pages
        WHERE page_id = $1 AND is_deleted = FALSE`,
      [pageId]
    )
    return rows[0]
  }

  static async updatePage(
    pageId: string,
    data: {
      pageTitle: string
      parentPageId: string | null
      pageSlug: string
    },
    userWhoUpdated: string
  ) {
    const { rows } = await supabasePool.query(
      `
    UPDATE pages
    SET
      page_title = $1,
      parent_page_id = $2,
      page_slug = $3,
      updated_by = $4,
      updated_date = NOW()
    WHERE page_id = $5
    RETURNING page_id, page_title, page_slug
    `,
      [data.pageTitle, data.parentPageId, data.pageSlug, userWhoUpdated, pageId]
    )

    return rows[0]
  }

  static async deletePage(pageId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE pages SET is_deleted = TRUE WHERE page_id = $1 RETURNING page_title`,
      [pageId]
    )
    return rows[0]
  }
}

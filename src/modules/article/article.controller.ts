import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { generateContentText } from '../../utils/convertContentTeks'
import { ResponseHelper } from '../../utils/responseHelper'
import { generateUniquePageSlug } from '../../utils/slug'
import { PageService } from '../pages/page/page.service'
import { ArticleCoverUploadProps, ArticleProps } from './article.model'
import { ArticleService } from './article.service'

export class ArticleController {
  static async addArticleController(
    payload: ArticleProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { title, coverUrl } = await ArticleService.extractArticleMeta(
      payload.contentBlocks
    )

    const parentPageId = await PageService.getParentPageId('Article')
    const pageSlug = await generateUniquePageSlug(title, 'Article')

    const { page_id } = await PageService.addPage(
      title,
      parentPageId,
      pageSlug,
      user.user_id
    )

    const contentTeks = await generateContentText(payload.contentBlocks)

    const articleId = await ArticleService.addArticle(
      page_id,
      payload,
      contentTeks,
      user.user_id,
      title,
      coverUrl
    )
    return ResponseHelper.created('Menambah article berhasil', articleId)
  }

  static async uploadCoverArticleController(
    payload: ArticleCoverUploadProps
  ): Promise<ApiResponse> {
    const coverUrl = await upload(payload.cover, '/article')
    return ResponseHelper.success('Berhasil upload cover article', {
      cover_url: coverUrl,
    })
  }
}

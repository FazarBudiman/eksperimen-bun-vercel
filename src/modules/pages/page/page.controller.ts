import { AuthUser } from '../../../types/auth.type'
import { ApiResponse } from '../../../types/response.type'
import { ResponseHelper } from '../../../utils/responseHelper'
import { generateUniquePageSlug } from '../../../utils/slug'
import { PageProps, ParamsPageProps } from './page.model'
import { PageService } from './page.service'

export class PageController {
  static async addPageController(
    payload: PageProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { pageTitle, parentPage } = payload
    let parentPageId = null
    let pageSlug

    if (parentPage) {
      parentPageId = await PageService.getParentPageId(parentPage)
      pageSlug = await generateUniquePageSlug(payload.pageTitle, parentPage)
    } else {
      pageSlug = await generateUniquePageSlug(payload.pageTitle)
    }

    const pageId = await PageService.addPage(
      pageTitle,
      parentPageId,
      pageSlug,
      user.user_id
    )

    return ResponseHelper.created('Menambah page baru berhasil', pageId)
  }

  static async getAllController(): Promise<ApiResponse> {
    const pages = await PageService.getAllPages()
    return ResponseHelper.success('Mengahmbil semua data page berhasil', pages)
  }

  static async getPageByIdController(
    params: ParamsPageProps
  ): Promise<ApiResponse> {
    const { pageId } = params
    await PageService.verifyPageIsExist(pageId)
    const page = await PageService.getPageById(pageId)
    return ResponseHelper.success('Mengambil data page berhasil', page)
  }

  static async updatePageController(
    payload: PageProps,
    params: ParamsPageProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { pageId } = params
    const { pageTitle, parentPage } = payload

    await PageService.verifyPageIsExist(pageId)

    let parentPageId: string | null = null
    if (parentPage) {
      parentPageId = await PageService.getParentPageId(parentPage)
    }

    const pageSlug = await generateUniquePageSlug(pageTitle, parentPage)

    const page = await PageService.updatePage(
      pageId,
      {
        pageTitle,
        parentPageId,
        pageSlug,
      },
      user.user_id
    )

    return ResponseHelper.success(
      `Mengupdate page '${page.page_title}' berhasil`,
      page
    )
  }

  static async deletePageController(
    params: ParamsPageProps
  ): Promise<ApiResponse> {
    const { pageId } = params
    await PageService.verifyPageIsExist(pageId)
    const { page_title } = await PageService.deletePage(pageId)
    return ResponseHelper.success(`Menghapus page: '${page_title}' berhasil`)
  }
}

import { AuthUser } from '../../../../types/auth.type'
import { ApiResponse } from '../../../../types/response.type'
import { ResponseHelper } from '../../../../utils/responseHelper'
import { ParamsPageProps } from '../page.model'
import { PageService } from '../page.service'
import { ParamsSeoProps, SeoProps } from './seo.model'
import { SeoService } from './seo.service'

export class SeoController {
  static async addSeoController(
    payload: SeoProps,
    params: ParamsPageProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { pageId } = params

    await PageService.verifyPageIsExist(pageId)
    const seoId = await SeoService.addSeo(payload, pageId, user.user_id)

    return ResponseHelper.created('Menambah SEO pada page berhasil', seoId)
  }

  static async getSeoByPageIdController(
    params: ParamsPageProps
  ): Promise<ApiResponse> {
    const { pageId } = params
    await PageService.verifyPageIsExist(pageId)
    const seos = await SeoService.getSeoByPageId(pageId)
    return ResponseHelper.success('Mengambil semua data SEO berhasil', seos)
  }

  static async getSeoByIdController(
    params: ParamsSeoProps
  ): Promise<ApiResponse> {
    const { seoId } = params
    await SeoService.verifySeoIsExist(seoId)
    const seo = await SeoService.getSeoById(seoId)
    return ResponseHelper.success('Mengambil seo pada page berhasil', seo)
  }

  static async updateSeoController(
    payload: Partial<SeoProps>,
    params: ParamsSeoProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    await SeoService.verifySeoIsExist(params.seoId)
    const { seo_id } = await SeoService.updateSeo(payload, params, user.user_id)
    return ResponseHelper.success(`Mengubah SEO : '${seo_id}' berhasil`)
  }

  static async changeStatusSeoController(
    params: ParamsSeoProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { seoId } = params
    await SeoService.verifySeoIsExist(seoId)
    const { seo_id } = await SeoService.changeStatusSeo(seoId, user.user_id)
    return ResponseHelper.success(`Mengubah Status SEO : '${seo_id}' berhasil`)
  }

  static async deleteSeoController(
    params: ParamsSeoProps
  ): Promise<ApiResponse> {
    await SeoService.verifySeoIsExist(params.seoId)
    const { seo_id } = await SeoService.deleteSeo(params)
    return ResponseHelper.success(`Menghapus SEO: '${seo_id}' berhasil`)
  }
}

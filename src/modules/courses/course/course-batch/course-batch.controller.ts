import { upload } from '../../../../shared/services/upload'
import { AuthUser } from '../../../../types/auth.type'
import { ApiResponse } from '../../../../types/response.type'
import { ResponseHelper } from '../../../../utils/responseHelper'
import { ParamsCourseProps } from '../course.model'
import { CourseService } from '../course.service'
import {
  CourseBatchPosterUploadProps,
  CourseBatchProps,
  ParamsCourseBatchProps,
} from './course-batch.model'

import { CourseBatchService } from './course-batch.service'

export class CourseBatchController {
  static async addCourseBatchController(
    payload: CourseBatchProps,
    params: ParamsCourseProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { courseId } = params
    await CourseService.verifyCourseisExist(courseId)
    const course_batch_id = await CourseBatchService.addCourseBatch(
      payload,
      courseId,
      user.user_id
    )
    return ResponseHelper.success('Menambah batch pada course berhasil', {
      course_batch_id,
    })
  }

  static async uploadCourseBatchPosterController(
    payload: CourseBatchPosterUploadProps,
    params: ParamsCourseBatchProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { courseId, batchId } = params
    await Promise.all([
      await CourseService.verifyCourseisExist(courseId),
      await CourseBatchService.verfifyCourseBatchisExist(batchId),
    ])

    const posterUrl = await upload(payload.poster, '/course')
    await CourseBatchService.addPosterUrlIntoBatch(
      posterUrl,
      batchId,
      user.user_id
    )

    return ResponseHelper.success('Upload poster pada batch berhasil', {
      poster_url: posterUrl,
    })
  }

  static async updateCourseBatchController(
    payload: Partial<CourseBatchProps>,
    params: ParamsCourseBatchProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { courseId, batchId } = params
    await Promise.all([
      await CourseService.verifyCourseisExist(courseId),
      await CourseBatchService.verfifyCourseBatchisExist(batchId),
    ])
    const course_batch_name = await CourseBatchService.updateCourseBatch(
      payload,
      batchId,
      user.user_id
    )
    return ResponseHelper.success(
      `Mengubah Course Batch : ${course_batch_name}`
    )
  }

  static async deleteCourseBatchController(
    params: ParamsCourseBatchProps
  ): Promise<ApiResponse> {
    const { courseId, batchId } = params
    await Promise.all([
      await CourseService.verifyCourseisExist(courseId),
      await CourseBatchService.verfifyCourseBatchisExist(batchId),
    ])

    const { course_batch_name } =
      await CourseBatchService.deleteCourseBatch(batchId)
    return ResponseHelper.success(
      `Menghapus Course Batch: ${course_batch_name} berhasil`
    )
  }
}

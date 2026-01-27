// import { CourseCreateProps } from './course.model'
import { ApiResponse } from '../../../types/response.type'
// import { AuthUser } from '../../../types/auth.type'
// import { upload } from '../../../shared/services/upload'
import { ResponseHelper } from '../../../utils/responseHelper'
import { QueryParamsCourseProps } from './course.model'
import { CourseService } from './course.service'

export class CourseController {
  // static async addCourseController(
  //   payload: CourseCreateProps,
  //   user: AuthUser
  // ): Promise<ApiResponse> {
  //   const coursePosterUrl = await upload(payload.coursePoster, '/course')
  //   const courseId = await CourseService.addCourse(
  //     payload,
  //     coursePosterUrl,
  //     user.user_id
  //   )
  //   return ResponseHelper.created('Menambah course berhasil', courseId)
  // }

  static async getAllCourseController(
    query: QueryParamsCourseProps
  ): Promise<ApiResponse> {
    const courses = await CourseService.getAllCourses(query)
    return ResponseHelper.success(
      'Mengambil seluruh data course berhasil',
      courses
    )
  }

  static async getUpcomingCourseController(): Promise<ApiResponse> {
    const upcomingCourse = await CourseService.getUpcomingCourse()
    return ResponseHelper.success(
      'Mengambil data upcoming course berhasil',
      upcomingCourse
    )
  }

  static async getCourseByIdController(courseId: string): Promise<ApiResponse> {
    await CourseService.verifyCourseisExist(courseId)
    const course = await CourseService.getDetailCourseById(courseId)
    return ResponseHelper.success(
      'Mengambil data detail course berhasil',
      course
    )
  }
}

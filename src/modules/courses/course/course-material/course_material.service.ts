import { PoolClient } from 'pg'
import { CourseMaterialProps } from './course-material.model'
import { supabasePool } from '../../../../supabase/supabasePool'

export class CourseMaterialService {
  static async replaceCourseMaterials(
    client: PoolClient,
    courseId: string,
    materials: CourseMaterialProps
  ) {
    await client.query(
      `DELETE FROM course_materials WHERE course_material_course_id = $1`,
      [courseId]
    )

    for (const m of materials) {
      await client.query(
        `INSERT INTO course_materials (
              course_material_course_id, course_material_title, 
              course_material_description, course_material_order_num)
            VALUES ($1, $2, $3, $4)`,
        [courseId, m.title, m.description, m.orderNum]
      )
    }
  }

  static async getCourseMaterialByCourseId(courseId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        course_material_title as title, course_material_description as description
      FROM course_materials
      WHERE course_material_course_id = $1
      ORDER BY course_material_order_num ASC`,
      [courseId]
    )
    return rows
  }
}

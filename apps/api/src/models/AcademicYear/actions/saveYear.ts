import { TermModel } from 'src/models/Term'
import { AcademicYearModel } from '../model'

export const saveYear = async (
  year: number | undefined,
  currTermId: number
) => {
  const find = await AcademicYearModel.findOne({
    include: {
      model: TermModel,
      where: {
        id: currTermId
      }
    }
  })
  if (find) {
    find.year = year
    find.save()
  }
}

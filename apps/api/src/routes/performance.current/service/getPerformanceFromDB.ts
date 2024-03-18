import { ICacheData } from "@helpers";
import { MarkModel, MarkValueModel, ScheduleModel, SubjectModel, TaskModel } from "@models";
import { marksPerformanceResource } from "src/resources";

export const getPerformanceFromDB = async (authData: ICacheData) => {
  const result = await SubjectModel.findAll({
    include: {
      model: ScheduleModel,
      include: [
        {
          model: TaskModel,
          include: [
            {
              model: MarkModel,
              include: [
                {
                  model: MarkValueModel,
                  required: true,
                  attributes: ["value"]
                },
              ],
              required: true
            },
          ],
          required: true
        }
      ]
    }
  })
  return marksPerformanceResource(result)
}
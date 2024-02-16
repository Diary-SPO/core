import { DiaryUserModel, DiaryUserModelType, IDiaryUserModel } from "@db"
import { Optional } from 'sequelize'

export const saveOrGetDiaryUser = async (data: Optional<DiaryUserModelType, "id">): Promise<IDiaryUserModel> => {
    const [record, isCreat] = await DiaryUserModel.findOrCreate({
        where: {
            login: data.login
        },
        defaults: {
            ...data
        }
    })

    if (!isCreat) {
        // Без await, т.к. обновляем "в фоне"
        record.update({
            ...data
        })
    }

    return record
}
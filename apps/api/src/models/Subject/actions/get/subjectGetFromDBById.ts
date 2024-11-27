import {SubjectModel} from "../../model";

export const subjectGetFromDBById = (subjectId: bigint) => SubjectModel.findOne({
    where: {
        id: subjectId
    }
})
import {
  SocialStepTypeModel,
  SocialStepTypeModelType
} from '../models/socialStepType'
import { Optional } from 'sequelize'

export const seedSocialStepType = async (
  steps: Optional<SocialStepTypeModelType, 'id'>[]
) => {
  return await SocialStepTypeModel.bulkCreate([...steps])
}

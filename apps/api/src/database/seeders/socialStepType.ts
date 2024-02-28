import { SocialStepTypeModel, SocialStepTypeModelType } from '@models'
import { Optional } from 'sequelize'

export const seedSocialStepType = async (
  steps: Optional<SocialStepTypeModelType, 'id'>[]
) => {
  return SocialStepTypeModel.bulkCreate([...steps])
}

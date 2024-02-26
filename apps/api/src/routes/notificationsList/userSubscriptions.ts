import { ICacheData } from "@db";
import { INotificationsList } from "./type";
import { SubscriptionTypeModel } from "src/services/models/subscriptionType";
import { SubscriptionModel } from "src/services/models/subscription";

export const userSubscriptions = async (list: INotificationsList[], userInfo: ICacheData) => {
    const subscriptionTypes = await SubscriptionTypeModel.findAll({
        include: {
            model: SubscriptionModel,
            where: {
                diaryUserId: userInfo.localUserId
            },
            required: false
        }
    })
    console.log(JSON.stringify(subscriptionTypes, null, 2))
}
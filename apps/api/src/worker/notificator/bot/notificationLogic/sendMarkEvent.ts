import {MarkEvent} from "../../types/MarkEvent";
import {getSubscribeInfo} from "./helpers/getSubscribeInfo";
import {getDetailedInfo} from "./helpers/getDetailedInfo";
import {buildMessageByEvent} from "../../messages";
import {bot} from "../botLogic";

export const sendMarkEvent = async (event: MarkEvent) => {
    const subscribe = await getSubscribeInfo(event)

    if (!subscribe)
        return

    const detailedInfo = await getDetailedInfo(event)

    if (!detailedInfo)
        return

    const message = buildMessageByEvent(detailedInfo)

    if (!bot || !message)
        return

    bot.sendMessage(String(subscribe.tgId), message)
}
import type {AvatarData} from "@diary-spo/shared";
import React, {useState} from "react";
import {Avatar, Skeleton, ToolButton, Tooltip} from "@vkontakte/vkui";
import {getUrlPath} from "./getUrlPath.tsx";
import {balanceFormatter} from "../HeaderBlock/balanceFormatter.tsx";
import {Icon16DiamondOutline, Icon16Gift} from "@vkontakte/icons";

const colorIcon = ({avatar, getUserBalance}: {avatar: AvatarData, getUserBalance: number}) => <Icon16DiamondOutline color={avatar.price > getUserBalance ? 'red' : undefined}/>

const AvatarPreviewComponent = (
	{avatar, onClickAvatarHandler, getUserBalance}: { avatar: AvatarData, onClickAvatarHandler: ((avatar: AvatarData) => void)|undefined, getUserBalance: number|undefined }
) => {
	let [isLoaded, setIsLoaded] = useState(false)
	return (
		<>
			<Skeleton width={110} height={110} borderRadius={100} hidden={isLoaded}/>
			<Avatar onClick={() => onClickAvatarHandler === undefined ? null : onClickAvatarHandler(avatar)}
							size={110}
							src={getUrlPath(avatar)}
							style={{isolation: 'auto'}}
							hidden={!isLoaded}
							onLoad={() => {
								setIsLoaded(true)
							}}
							onLoadStart={() => {
								setIsLoaded(false)
							}}
			>
				{
					getUserBalance !== undefined &&
            <Avatar.Badge className='select-avatar_badge'>

                <Tooltip
                    title={avatar.price ? `${balanceFormatter(avatar.price)} алмазов` : 'Бесплатно'}
                >
                    <ToolButton
                        IconCompact={avatar.price ? () => colorIcon({
													avatar,
													getUserBalance: getUserBalance ?? 0
												}) : Icon16Gift}
                        IconRegular={avatar.price ? () => undefined : Icon16Gift}
                    >
											{
												avatar.price > 0 &&
                          <label
                              className={avatar.price > (getUserBalance ?? 0) ? 'no-money' : ''}>{balanceFormatter(avatar.price)}</label>
											}
                    </ToolButton>
                </Tooltip>

            </Avatar.Badge>
				}
			</Avatar>
		</>
	)
}

export const MemorizedAvatarPreview = React.memo(AvatarPreviewComponent)
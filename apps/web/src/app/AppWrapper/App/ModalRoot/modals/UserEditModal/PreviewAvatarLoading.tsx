import {winxAva} from "../../../../../../shared/config/images.ts";
import {getUrlPath} from "../../../../../../pages/Market/components/AvatarsBlock/getUrlPath.tsx";
import {Avatar, Skeleton} from "@vkontakte/vkui";
import {Icon16DoneCircle, Icon16SyncCircleFillBlack} from "@vkontakte/icons";
import {useState} from "react";
import {AvatarData} from "@diary-spo/shared";
import './index.css'

export const PreviewAvatarLoading = (
	{selectAva, selectNewAvatar, avatar, isSaveNewAvatarLoading}: {selectAva: AvatarData|null, selectNewAvatar: (avatar: AvatarData) => void, isSaveNewAvatarLoading: boolean, avatar: AvatarData}) => {
	let [isLoaded, setIsLoaded] = useState(false)
	return (
		<>
			<Skeleton className={selectAva === avatar ? 'select-avatar' : ''}
								width={selectAva === avatar ? 100 : 110}
								height={selectAva === avatar ? 100 : 110}
								borderRadius={100}
								hidden={isLoaded}
			/>
			<Avatar
				size={110}
				src={avatar.filename != winxAva ? getUrlPath(avatar) : winxAva}
				onClick={() => selectNewAvatar(avatar)}
				className={selectAva === avatar ? 'select-avatar' : ''}
				onLoad={() => setIsLoaded(true)}
				onLoadStart={() => setIsLoaded(false)}
				hidden={!isLoaded}
			>
				<Avatar.Badge
					hidden={selectAva !== avatar}
					className='select-avatar_badge'
				>
					{
						isSaveNewAvatarLoading
							? <Icon16SyncCircleFillBlack height={25} width={25}/>
							: <Icon16DoneCircle height={25} width={25}/>
					}
				</Avatar.Badge>
			</Avatar>
		</>
	)
}
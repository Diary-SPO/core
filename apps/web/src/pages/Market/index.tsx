import {Panel, View} from '@vkontakte/vkui'
import {type FC, useState} from 'react'
import {PanelHeaderWithBack} from '../../shared'
import Filters from './components/filtersPanel.tsx'
import MarketHeader from './components/marketHeader.tsx'
import AvatarsPanel from "./components/avatarsPanel.tsx";

interface Props {
}

const avatars = [
	{
		isAnimated: true,
		filename: '806.gif',
		tags: ['Девушка'],
		price: 0
	},
	{
		isAnimated: false,
		filename: '1209.gif',
		tags: ['Парень'],
		price: 250
	},
	{
		isAnimated: false,
		filename: '689.jpg',
		tags: ['Девушка'],
		price: 350
	},
	{
		isAnimated: false,
		filename: '688.jpg',
		tags: ['Девушка'],
		price: 1000
	}
]

const tags: string[] = []
avatars.forEach(avatar => {
	avatar.tags.forEach((tag) => {
		if (!tags.includes(tag))
			tags.push(tag)
	})
})

const Market: FC<Props> = () => {
	const [activePanel] = useState('market')

	// ФИЛЬТРЫ
	const [isAnimated, setIsAnimated] = useState(true)
	const [isStatic, setIsStatic] = useState(true)
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	const changeIsAnimated = () => {
		setIsAnimated(!isAnimated)
	}

	const changeIsStatic = () => {
		setIsStatic(!isStatic)
	}

	return (
		<View activePanel={activePanel}>
			<Panel id='market'>
				<PanelHeaderWithBack title='Магазин'/>
				<MarketHeader/>
				<Filters isAnimated={isAnimated}
								 isStatic={isStatic}
								 changeIsAnimated={changeIsAnimated}
								 changeIsStatic={changeIsStatic}
								 avatars={avatars}
								 setSelectedTags={setSelectedTags}
								 selectedTags={selectedTags}
								 tags={tags}/>
				<AvatarsPanel avatars={avatars}
											isStatic={isStatic}
											isAnimated={isAnimated}
											selectedTags={selectedTags}/>
			</Panel>
		</View>
	)
}

export default Market

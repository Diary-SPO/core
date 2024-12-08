import {FC, useState} from "react";
import {
	Avatar, Button,
	Card,
	Div,
	Flex,
	ModalPage,
	ModalPageHeader, Placeholder, Spinner,
	Subhead,
	Text,
} from "@vkontakte/vkui";
import {useBuyModal} from "@store";
import {Icon16DiamondOutline, Icon16Gift, Icon56HourglassErrorBadgeOutline} from "@vkontakte/icons";
import {getUrlPath} from "../../../../../../pages/Market/components/AvatarsBlock/getUrlPath.tsx";
import {client} from "../../../../../../shared/api/client.ts";
import {isApiError} from "../../../../../../shared";
import {balanceFormatter} from "../../../../../../pages/Market/components/HeaderBlock/balanceFormatter.tsx";

type Props = {
	id: string
}

export const BuyModal: FC<Props> = ({id}) => {
	const { modalData } = useBuyModal()
	const [isLoading, setIsLoading] = useState(false)
	const [isAlreadyBuy, setIsAlreadyBuy] = useState(false)
	const [isSuccessBuy, setIsSuccessBuy] = useState(false)
	const [isError, setIsError] = useState(false)

	const onClickBuyButtonHandler = async () => {
		if (!modalData?.avatar)
			return
		setIsError(false)
		setIsLoading(true)
		try {
			const { data } = await client.buyAvatar.post({avatarId: `${modalData.avatar.id}`})

			if (data === null || isApiError(data))
				throw new Error('Ошибка с сервера')

			if (data.isSuccess) {
				setIsSuccessBuy(true)
			} else if (modalData.balance ?? 0 >= modalData.avatar.price) {
				setIsAlreadyBuy(true)
			}

			modalData.setBalance(data.currentBalance)
		} catch {
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<ModalPage id={id} onClosed={() => {
			setIsAlreadyBuy(false)
			setIsSuccessBuy(false)
			setIsError(false)
			setIsLoading(false)
		}} dynamicContentHeight>
			<ModalPageHeader>Купить предмет</ModalPageHeader>
			{
				modalData.avatar &&
				(isError ?
					<Placeholder>
						<Placeholder.Icon>
							<Icon56HourglassErrorBadgeOutline />
						</Placeholder.Icon>
						<Placeholder.Title>Ошибка покупки аватарки</Placeholder.Title>
						<Placeholder.Description>
							Возможно, сервер сейчас не может обработать запрос
						</Placeholder.Description>
					</Placeholder>
					:
          <Div>
              <Subhead
                  style={{marginBottom: 5}}>{modalData.avatar.isAnimated ? 'Анимированный' : 'Статичный'} аватар</Subhead>
              <Text weight="3" style={{marginBottom: 15}}>
                  Купите этот предмет за алмазы, заработанные за активность в приложении.
              </Text>
              <Card>
                  <Div>
                      <Flex justify='center' align='center' direction='column' gap={10}>
                          <Avatar size={190} src={getUrlPath(modalData.avatar)} style={{isolation: 'auto'}}/>
                          <Button after={isLoading
														? <Spinner/>
														: modalData.avatar.price ? <Icon16DiamondOutline/> : <Icon16Gift/>
													}
                                  appearance='positive' size='l'
                                  disabled={modalData.avatar.price > (modalData.balance ?? 0) || isAlreadyBuy || isSuccessBuy}
                                  onClick={() => onClickBuyButtonHandler()}>
														{
															isLoading
																? 'Покупаю ...'
																: isAlreadyBuy ? `Вы уже покупали` :
																	isSuccessBuy ? 'Успешно куплено' : modalData.avatar.price > 0
																		? `Купить за ${balanceFormatter(modalData.avatar.price)}`
																		: 'Забрать бесплатно'
														}
                          </Button>
												{
													modalData.avatar.price > 0
													&& <Subhead>
                                <i>
                                    *у вас на балансе {balanceFormatter(modalData.balance ?? 0)}
                                </i> {' '}
                                <Icon16DiamondOutline
                                    height={20}
                                style={{
																	display: 'inline-block',
																	verticalAlign: 'text-top'
																}}/>
                            </Subhead>
												}
                      </Flex>
                  </Div>
              </Card>
          </Div>
				)
			}
		</ModalPage>
	)
}
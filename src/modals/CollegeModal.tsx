import {
  Group, Header, InfoRow, Link, ModalPage, ModalPageHeader, SimpleCell,
} from '@vkontakte/vkui';
import { useModal } from './ModalContext';

const CollegeModal = ({ id }: { id: string }) => {
  const { collegeModalData } = useModal();

  return (
    <ModalPage id={id} size={500}>
      <ModalPageHeader>Подробнее о колледже</ModalPageHeader>
      <Group header={<Header>Основная информация</Header>}>
        <SimpleCell multiline>
          <InfoRow header='Полное название'>{collegeModalData?.name}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Основной адрес'>{collegeModalData?.actualAddress}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Директор'>{collegeModalData?.directorName}</InfoRow>
        </SimpleCell>
      </Group>
      <Group header={<Header>Дополнительная информация</Header>}>
        <SimpleCell multiline>
          <InfoRow header='Почта'>{collegeModalData?.email}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Факс'>{collegeModalData?.fax}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Номер телефона'>{collegeModalData?.phone}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Сайт'>
            <Link href={collegeModalData?.site} target='_blank'>
              {collegeModalData?.site}
            </Link>
          </InfoRow>
        </SimpleCell>
      </Group>
    </ModalPage>
  );
};

export default CollegeModal;

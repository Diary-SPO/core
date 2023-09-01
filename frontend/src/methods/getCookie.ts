import bridge from '@vkontakte/vk-bridge';

export const getCookie = async () => {
  bridge.send('VKWebAppStorageGet', {
    keys: ['cookie'],
  })
    .then((data) => !(data.keys[0].value === null || data.keys[0].value === undefined))
    .catch((error) => {
        return error
    });
};

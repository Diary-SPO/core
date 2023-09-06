import bridge from '@vkontakte/vk-bridge';

export const getUserId = async () => {
  try {
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: ['id'],
    });
    console.log('data_id in getUserId', data);
    if (data.keys) {
      return data.keys[0].value;
    }
    return 'no id';
  } catch (error) {
    console.error(error);
    return false;
  }
};

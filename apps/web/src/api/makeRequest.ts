// import { BASE_URLS } from '@config'
// import { HTTP_STATUSES, type ServerResponse } from '@types'
// import { isApiError } from '@utils'
// import axios from 'axios'
//
// const makeRequest = async <T>(
//   route: string,
//   method: 'POST' | 'GET' = 'GET',
//   body?: BodyInit
// ): Promise<ServerResponse<T>> => {
//   const token = localStorage.getItem('token')
//
//   const headers = {
//     'Content-Type': 'application/json;charset=UTF-8',
//     secret: token
//   }
//
//   for (const BASE_URL of BASE_URLS) {
//     try {
//       const response = await axios<T>({
//         method,
//         url: `${BASE_URL}${route}`,
//         headers,
//         data: body,
//         timeout: 2000
//       })
//
//       // console.info('%c [makeRequest]', 'color: blueviolet', response)
//
//       return response.data
//     } catch (err) {
//       if (!isApiError(err)) {
//         console.info('%c [NOT AXIOS ERROR]', 'color: red', err)
//         return
//       }
//
//       // console.info('%c [makeRequest]', 'color: blueviolet', err)
//
//       /** В случае ошибки авторизации мы не делаем запрос на другой сервер, а сразу возвращаем ответ **/
//       if (err?.status === HTTP_STATUSES.UNAUTHORIZED) {
//         return err
//       }
//     }
//   }
//
//   /** Если ни один сервер не был обработан верно **/
//   // return new Response('', {
//   //   status: 520,
//   //   headers: { 'Content-Type': 'application/json' }
//   // })
// }
//
// export default makeRequest

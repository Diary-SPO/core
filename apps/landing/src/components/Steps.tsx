export function Steps() {
  return (
    <section id='steps' className='container section'>
      <div className='section-head reveal'>
        <h2>Как войти за минуту</h2>
        <p>Тот же логин и пароль, что для Сетевого города в браузере.</p>
      </div>
      <ol className='steps reveal'>
        <li>
          <span className='step-n'>1</span>
          <b>Установите</b>
          <span>через RuStore или APK с этого сайта</span>
        </li>
        <li>
          <span className='step-n'>2</span>
          <b>Выберите регион</b>
          <span>найдите свой город и портал дневника</span>
        </li>
        <li>
          <span className='step-n'>3</span>
          <b>Введите логин и пароль</b>
          <span>пароль уходит напрямую в дневник и не хранится</span>
        </li>
      </ol>
    </section>
  )
}

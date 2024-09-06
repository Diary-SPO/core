angular
  .module('app', [
    'ngRoute',
    'app.global.filters',
    'app.global.services',
    'app.global.services.rest',
    'app.global.services.rest.mock',
    'app.global.directives',
    'app.global.translation',
    'app.security.login',
    'app.security.templates',
    'pascalprecht.translate'
  ])
  .config([
    '$routeProvider',
    '$locationProvider',
    '$translateProvider',
    '$pooTranslationProvider',
    (e, t, r, n) => (
      e.otherwise({ redirectTo: '/login' }),
      t.html5Mode(!1),
      console.log('security module'),
      n.setupTranslation(r)
    )
  ]),
  angular
    .module('app.security.login.controllers', [])
    .controller('Authentication', [
      '$scope',
      'session',
      'busyPromise',
      'errors',
      '$liteBox',
      'loginRest',
      'supportRest',
      '$window',
      'esiaSettingsService',
      'localSettings',
      'organizationRest',
      '$translate',
      (r, n, e, o, t, i, s, a, l, u, c, g) => {
        let p
        return (
          (r.$root.pageTitle = 'Вход'),
          e(s.getVersion(), r).then((e) => (r.version = e.data)),
          e(c.loadSystemInfo(), r).then(
            (e) => {
              let t
              if (
                ((r.systemTitle =
                  null != e && null != (t = e.data) ? t.title : void 0),
                (r.$root.systemTitle = r.systemTitle),
                console.log(
                  '$scope.$root.defaultLanguage',
                  r.$root.defaultLanguage
                ),
                !r.$root.defaultLanguage)
              )
                return (
                  (r.$root.defaultLanguage =
                    null != e && null != (t = e.data)
                      ? t.defaultLanguage
                      : void 0),
                  console.log(
                    '$scope.$root.defaultLanguage',
                    r.$root.defaultLanguage
                  ),
                  g.use(r.$root.defaultLanguage)
                )
            },
            (e) =>
              t.errorBox('Произошла ошибка загрузки информации о системе', e)
          ),
          (p = new Hashes.SHA256()),
          e(l.loadEsiaSettings()).then(
            () => (
              u.set('isEsiaAvailable', l.getEsiaSettings().isAvailable),
              (r.isEsiaAvailable = l.getEsiaSettings().isAvailable)
            )
          ),
          _.extend(r, {
            credentials: { login: '', password: '', isRemember: !1 },
            loginWithEsia: () =>
              l.redirectToLoginGateway(l.getEsiaSettings().loginUrl),
            authenticate: (t) => {
              if ((t.$setValidity('rest', !0), t.$valid))
                return e(
                  i.login({
                    login: r.credentials.login,
                    password: p.b64(r.credentials.password),
                    isRemember: r.credentials.isRemember
                  }),
                  r
                ).then(
                  (e) => n.redirectFromLoginPage(e.data),
                  (e) => o.handleRestError(e, t)
                )
            }
          })
        )
      }
    ])
    .controller('GetTenants', [
      '$scope',
      'session',
      'busyPromise',
      'loginRest',
      (e, t, r, n) =>
        r(n.getTenantsForEsia().then((e) => t.redirectFromLoginPage(e.data)))
    ])
    .controller('ForgotPassword', [
      '$scope',
      'busyPromise',
      'errors',
      'loginRest',
      '$liteBox',
      'organizationRest',
      (r, e, n, o, t, i) => (
        (r.$root.pageTitle = 'Восстановление пароля'),
        e(i.loadSystemInfo(), r).then(
          (e) =>
            (r.systemTitle =
              null != e && null != (e = e.data) ? e.title : void 0),
          (e) => t.errorBox('Произошла ошибка загрузки информации о системе', e)
        ),
        _.extend(r, {
          params: { email: '', isMessageSent: !1 },
          submit: (t) => {
            if ((t.$setValidity('rest', !0), t.$valid))
              return e(o.forgotPassword(r.params.email), r).then(
                () => (r.params.isMessageSent = !0),
                (e) => n.handleRestError(e, t)
              )
          }
        })
      )
    ])
    .controller('ResetPassword', [
      '$scope',
      '$routeParams',
      'session',
      'busyPromise',
      'errors',
      'loginRest',
      '$liteBox',
      'organizationRest',
      (r, e, n, o, i, s, t, a) => {
        let l
        let u
        return (
          (r.$root.pageTitle = 'Изменение пароля'),
          o(a.loadSystemInfo(), r).then(
            (e) =>
              (r.systemTitle =
                null != e && null != (e = e.data) ? e.title : void 0),
            (e) =>
              t.errorBox('Произошла ошибка загрузки информации о системе', e)
          ),
          (l = new Hashes.SHA256()),
          (u = e.securityKey),
          o(s.validateForgotPassword(u), r).then(
            (e) => (r.tenants = e.data),
            () => (r.tenants = [])
          ),
          _.extend(r, {
            params: { password: '', confirmPassword: '' },
            submit: (t) => {
              if ((t.$setValidity('rest', !0), t.$valid))
                return o(s.resetPassword(u, l.b64(r.params.password)), r).then(
                  (e) => n.redirectFromLoginPage(e.data),
                  (e) => i.handleRestError(e, t)
                )
            }
          })
        )
      }
    ]),
  angular
    .module('app.security.login.directives', [])
    .directive(
      'appear',
      () => (e, t) => setTimeout(() => t.addClass('appear'), 500)
    )
    .directive('equals', () => ({
      restrict: 'A',
      require: 'ngModel',
      scope: { equals: '=' },
      link: (t, e, r, n) => {
        const o = (e, t) =>
          n.$setValidity('equals', _.isEmpty(e) || _.isEmpty(t) || e === t)
        return (
          t.$watch(
            () => n.$modelValue,
            (e) => o(e, t.equals)
          ),
          t.$watch('equals', (e) => o(n.$modelValue, e))
        )
      }
    }))
    .directive('formAutofillFix', () => (t, r, n) => {
      if ((r.prop('method', 'POST'), n.ngSubmit))
        return setTimeout(
          () =>
            r
              .unbind('submit')
              .submit(
                (e) => (
                  e.preventDefault(),
                  r
                    .find('input, textarea, select')
                    .trigger('input')
                    .trigger('change')
                    .trigger('keydown'),
                  t.$apply(n.ngSubmit)
                )
              ),
          0
        )
    }),
  angular
    .module('app.security.login', [
      'app.security.login.directives',
      'app.security.login.controllers',
      'app.security.login.services.rest',
      'app.security.login.services.rest.mock',
      'pascalprecht.translate'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e
          .when('/login', {
            templateUrl: 'app/security/login/view.authentication.pug',
            controller: 'Authentication'
          })
          .when('/forgot', {
            templateUrl: 'app/security/login/view.forgot-password.pug',
            controller: 'ForgotPassword'
          })
          .when('/reset/:securityKey', {
            templateUrl: 'app/security/login/view.reset-password.pug',
            controller: 'ResetPassword'
          })
          .when('/notfound', {
            templateUrl: 'app/security/login/view.not-found.pug'
          })
          .when('/error', {
            templateUrl: 'app/security/login/view.esia-error.pug'
          })
          .when('/tenants', { template: '', controller: 'GetTenants' })
          .when('/esia/crosslogin', {
            template: '',
            controller: [
              '$window',
              'esiaSettingsService',
              'busyPromise',
              (e, t, r) => {
                r(t.loadEsiaSettings()).then(() =>
                  t.redirectToLoginGateway(t.getEsiaSettings().loginUrl)
                )
              }
            ]
          })
    ]),
  angular
    .module('app.security.login.services.rest', [])
    .service('loginRest', [
      '$http',
      (r) => ({
        login: (e) => r.post('/services/security/login', e),
        forgotPassword: (e) =>
          r.post('/services/security/forgot-password', { email: e }),
        validateForgotPassword: (e) =>
          r.get(`/services/security/forgot-password/${e}`),
        resetPassword: (e, t) =>
          r.put(`/services/security/reset-password/${e}`, { password: t }),
        getTenantsForEsia: () => r.get('/services/security/get-esia-tenants')
      })
    ]),
  angular.module('app.security.login.services.rest.mock', [])

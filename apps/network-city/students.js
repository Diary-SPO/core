angular
  .module('app', [
    'ngSanitize',
    'ngRoute',
    'app.global.constants',
    'app.global.controllers',
    'app.global.filters',
    'app.global.services',
    'app.global.services.rest',
    'app.global.services.rest.mock',
    'app.global.directives',
    'app.global.translation',
    'app.students.attestation',
    'app.students.dashboard',
    'app.students.lessons',
    'app.students.reports',
    'app.students.account',
    'app.students.chats',
    'app.students.employment',
    'app.students.templates'
  ])
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    'parseDatesFromJsonProvider',
    '$pooTranslationProvider',
    '$translateProvider',
    (e, t, n, r, o, s) => (
      e.otherwise({ redirectTo: '/' }),
      t.html5Mode(!1),
      r.parse(n),
      o.setupTranslation(s)
    )
  ])
  .directive('children', [
    'studentSelector',
    (n) => ({
      restrict: 'E',
      replace: !0,
      template:
        '<div x-ng-if="students.length &gt; 1"> <a x-ng-repeat="student in students track by $index", x-ng-class="student == selectedStudent ? \'icon-check\' : \'icon-empty\'", x-ng-click="select(student)"> <small>{{ (student | personName) + \' (гр. \' + student.groupName + \')\'}}</small> </a> <hr> </div>',
      link: (t) => (
        (t.select = (e) => n.setStudent((t.selectedStudent = e))),
        (t.students = n.getStudents()),
        t.select(n.getStudent())
      )
    })
  ])
  .provider('studentSelector', () => {
    let r = () => []
    return {
      config: (e) => (r = e),
      $get: [
        '$rootScope',
        'session',
        (t, n) => ({
          student: null,
          students: null,
          getStudents: function () {
            let e
            return null != (e = this.students)
              ? e
              : (this.students = r(n.getTenant()))
          },
          getStudent: function () {
            let e
            return null != (e = this.student)
              ? e
              : (this.student = _.first(this.getStudents()))
          },
          setStudent: function (e) {
            return t.$broadcast('studentChanged', (this.student = e))
          }
        })
      ]
    }
  }),
  angular
    .module('app-parent', ['app'])
    .config([
      'studentSelectorProvider',
      (e) => e.config((e) => e.parentRole.students)
    ])
    .run(['session', 'globalRun', (e, t) => (e.checkParentAccess(), t.run())]),
  angular
    .module('app-student', ['app'])
    .config([
      'studentSelectorProvider',
      (e) =>
        e.config(
          (e) => (
            console.log('studentSelectorProvider', e), e.studentRole.students
          )
        )
    ])
    .run(['session', 'globalRun', (e, t) => (e.checkStudentAccess(), t.run())]),
  angular
    .module('app.students.account', [
      'app.students.account.controllers',
      'app.students.account.services.rest'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e
          .when('/account/settings', {
            templateUrl: 'app/students/account/view.settings.pug',
            controller: 'Students.AccountSettings.View'
          })
          .when('/account/certificate', {
            templateUrl: 'app/students/account/view.certificate.pug',
            controller: 'Students.AccountCertificate.View'
          })
    ]),
  angular
    .module('app.students.account.controllers', [])
    .controller('Students.AccountSettings.View', [
      '$scope',
      'session',
      'busyPromise',
      'errors',
      'accountRest',
      'userRoles',
      'esiaSettingsService',
      '$liteBox',
      'localSettings',
      'redirect',
      '$window',
      (a, i, r, e, o, t, s, u, c, n, l) => {
        let d
        let p
        let f
        return (
          (a.$root.pageTitle = 'Настройки'),
          (p = () =>
            r(o.getSettings(), a).then((e) => {
              let t
              let n
              let r
              let o
              let s
              for (
                a.accounts = e.data.persons,
                  a.accountsLoaded = !0,
                  console.log('session.getTenant()', i.getTenant()),
                  n = i.getTenant(),
                  r = 0,
                  o = (s = a.accounts).length;
                r < o;
                r++
              )
                (t = s[r]),
                  n.settings.organization.organizationId === t.orgId &&
                    (a.person = t)
              return console.log('$scope.accounts', a.accounts)
            })),
          (f = () =>
            r(s.loadEsiaSettings()).then(
              () => (
                c.get('isEsiaAvailable', !1) || n.toLoginPage(),
                (a.esiaOnly = s.getEsiaSettings().esiaOnly),
                console.log('getEsiaSettings', s.getEsiaSettings()),
                console.log('$scope.esiaOnly', a.esiaOnly)
              )
            )),
          (a.accountsLoaded = !(d = () =>
            u
              .liteBox()
              .open(
                'app/students/account/dialog.add-account.pug',
                'AccountSettings.AddAccount'
              ))),
          f(),
          p(),
          _.extend(a, {
            role: _.findWhere(t.getRoles(i.getTenant()), { selected: !0 }),
            isEsiaAvailable: c.get('isEsiaAvailable', !1),
            isEsiaOnly: c.get('isEsiaOnly', !1),
            addNewLogin: () => (
              console.log('addNewLogin'),
              d().then(
                (e) => (p(), l.location.reload(), console.log('addAccount', e))
              )
            ),
            bind: () => s.bindEsia(),
            unbind: (t, n) =>
              u
                .confirmDelete(
                  'Вы действительно хотите удалить связь с учётной записью на портале гос. услуг?'
                )
                .then((e) => {
                  if (e)
                    return r(s.unbindEsiaToken(t, n), a).then(
                      (e) => (
                        console.log('unbing response', e),
                        f(),
                        p(),
                        r(
                          o
                            .getTenantsForEsia()
                            .then(
                              (e) => (
                                console.log('getTenantsForEsia', e.data),
                                c.set('tenants', e.data.tenants),
                                l.location.reload()
                              )
                            )
                        )
                      ),
                      (e) =>
                        u.errorBox(
                          'Произошла ошибка удаления связи с учётной записью на портале гос. услуг',
                          e
                        )
                    )
                })
          })
        )
      }
    ])
    .controller('AccountSettings.AddAccount', [
      '$scope',
      'liteBox',
      'busyPromise',
      'accountRest',
      'errors',
      'localSettings',
      (e, n, r, o, s, a) => {
        const i = new Hashes.SHA256()
        return _.extend(e, {
          login: '',
          password: '',
          close: () => n.close(null),
          submit: (t) => {
            if ((t.$setValidity('rest', !0), t.$valid))
              return (
                console.log('введены', e.login, e.password),
                r(
                  o.addLogin({ login: e.login, password: i.b64(e.password) }),
                  e
                ).then(
                  (e) => (
                    console.log('returned', e, a.get('tenants')),
                    a.set('tenants', e.data.tenants),
                    n.close(null)
                  ),
                  (e) => (
                    console.log('authenticate error', e, t),
                    s.handleRestError(e, t)
                  )
                )
              )
          }
        })
      }
    ])
    .controller('Students.AccountCertificate.View', [
      '$scope',
      'session',
      'busyPromise',
      'errors',
      'supplementaryCertificateRest',
      'studentSelector',
      'userRoles',
      '$liteBox',
      'certificateScreenState',
      (n, e, r, t, o, s, a, i, u) => {
        const c =
          '/students/parent.html' ===
          _.findWhere(a.getRoles(e.getTenant()), { selected: !0 }).href
        const a = () => {
          let t
          let e
          return (
            r(
              o.loadStudentInfo(null != (e = s.getStudent()) ? e.id : void 0),
              n
            ).then((e) => {
              if (
                ((n.studentInfo = e.data),
                console.log('$scope.studentInfo', n.studentInfo),
                n.studentInfo.certificateAllowed ||
                n.studentInfo.certificateAvailable
                  ? n.studentInfo.certificateAvailable
                    ? (n.screenState = u.available)
                    : n.studentInfo.needParentToReceiveCertificate && !c
                      ? (n.screenState = u.onlyParent)
                      : (n.screenState = u.notAvailable)
                  : (n.screenState = u.notAllowed),
                console.log('$scope.screenState'),
                n.studentInfo.certificateAvailable)
              )
                return t()
            }),
            (t = () => {
              let e
              return (
                console.log('loadCertificate'),
                r(
                  o.loadCertificateInfo(
                    null != (e = s.getStudent()) ? e.id : void 0
                  ),
                  n
                ).then(
                  (e) => (
                    (n.certificateInfo = e.data),
                    console.log(n.certificateInfo),
                    console.log('$scope.screenState', n.screenState)
                  ),
                  (e) =>
                    i.errorBox(
                      'Произошла ошибка загрузки информации о сертификате',
                      e
                    )
                ),
                r(
                  o.isFileAvailable(
                    null != (e = s.getStudent()) ? e.id : void 0
                  ),
                  n
                ).then(
                  (e) => (n.isFileAvailable = e.data),
                  (e) =>
                    i.errorBox(
                      'Произошла ошибка загрузки информации о доступности файла',
                      e
                    )
                )
              )
            }),
            _.extend(n, {
              certificateScreenState: u,
              studentId: null != (e = s.getStudent()) ? e.id : void 0,
              templateKind: c ? 2 : 1,
              addCertificate: () => {
                if (
                  (console.log(
                    'addCertificate',
                    n.studentInfo.hasIdentityDocument
                  ),
                  n.studentInfo.hasIdentityDocument)
                )
                  return i
                    .liteBox({
                      resolve: {
                        student: () => s.getStudent(),
                        studentInfo: () => n.studentInfo,
                        birthday: () => n.studentInfo.birthday
                      }
                    })
                    .open(
                      'app/students/account/dialog.student-add-certificate.pug',
                      'Students.AddCertificate'
                    )
                    .then((e) => {
                      if (null != e)
                        return (
                          (n.studentInfo.certificateAvailable = !0),
                          (n.screenState = u.available),
                          (n.certificateInfo = e)
                        )
                    })
                i.warningBox(
                  'Для получения сертификата у студента должен быть заполнен документ удостоверяющий личность.'
                )
              }
            })
          )
        }
        return a(), n.$on('studentChanged', a)
      }
    ])
    .controller('Students.AddCertificate', [
      '$scope',
      'liteBox',
      'busyPromise',
      'errors',
      'supplementaryCertificateRest',
      'student',
      'studentInfo',
      'birthday',
      (n, r, e, o, s, t, a, i) => {
        let u
        return (
          console.log('student', t),
          console.log('birthday', i),
          a.needParentToReceiveCertificate,
          (u = (t) =>
            (n.certificateCategories = n.allcertificateCategories.filter(
              (e) => e.munucipalityId === t
            ))),
          e(s.loadMunicipalities(), n).then(
            (e) => (n.municipalities = e.data),
            (e) =>
              $liteBox.errorBox(
                'Произошла ошибка загрузки списка муниципалитетов',
                e
              )
          ),
          e(s.loadCertificateCategories(), n).then(
            (e) => (
              (n.allcertificateCategories = e.data),
              (n.certificateCategories = []),
              (n.categoriesEmpty = !0)
            ),
            (e) =>
              $liteBox.errorBox(
                'Произошла ошибка загрузки списка категорий сертификатов',
                e
              )
          ),
          _.extend(n, {
            municipality: '',
            certificateCategory: '',
            person: _.cloneDeep(t),
            birthday: i,
            selectOptionName: () =>
              n.categoriesEmpty ? 'Нет категорий' : 'Выберите категорию',
            close: () => r.close(null),
            submit: (t) => {
              if ((t.$setValidity('rest', !0), t.$valid))
                return e(
                  s.receiveCertificate(
                    n.person.id,
                    n.municipality,
                    n.certificateCategory
                  ),
                  n
                ).then(
                  (e) => (
                    console.log('result.data', e.data),
                    console.log(
                      '$scope.person.certificate',
                      n.person.certificate
                    ),
                    r.close(e.data)
                  ),
                  (e) => o.handleRestError(e, t)
                )
            }
          }),
          n.$watch('municipality', (e) => {
            if (
              (console.log('municipality watch', e),
              void 0 !== e && void 0 !== n.allcertificateCategories)
            )
              return (
                (n.certificateCategories = u(e)),
                (n.categoriesEmpty = n.certificateCategories.length <= 0)
              )
          })
        )
      }
    ]),
  angular
    .module('app.students.account.services.rest', [])
    .service('accountRest', [
      '$http',
      (t) => ({
        getSettings: () => t.get('/services/security/account-settings'),
        addLogin: (e) => t.post('/services/security/add-login', e),
        getTenantsForEsia: () => t.get('/services/security/get-esia-tenants')
      })
    ])
    .service('supplementaryCertificateRest', [
      '$http',
      (r) => ({
        loadMunicipalities: () =>
          r.get('/services/people/supplementarycertificate/municipalities'),
        loadCertificateCategories: () =>
          r.get(
            '/services/people/supplementarycertificate/certificatecategories'
          ),
        loadCertificateInfo: (e) =>
          r.get(
            `/services/people/supplementarycertificate/loadCertificateInfo/${e}`
          ),
        isFileAvailable: (e) =>
          r.get(
            `/services/people/supplementarycertificate/isfileavailable/${e}`
          ),
        loadStudentInfo: (e) =>
          r.get(
            `/services/people/supplementarycertificate/loadStudentInfo/${e}`
          ),
        receiveCertificate: (e, t, n) =>
          r.post(
            `/services/people/supplementarycertificate/receiveCertificate/${e}`,
            { municipalityId: t, categoryId: n }
          )
      })
    ]),
  angular
    .module('app.students.attestation', [
      'app.students.attestation.controllers',
      'app.students.attestation.filters',
      'app.students.attestation.services.rest',
      'app.students.attestation.services.rest.mock'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e.when('/attestation', {
          templateUrl: 'app/students/attestation/view.attestation.pug',
          controller: 'Students.Attestation.View'
        })
    ]),
  angular
    .module('app.students.attestation.controllers', [])
    .controller('Students.Attestation.View', [
      '$scope',
      '$liteBox',
      'studentSelector',
      'busyPromise',
      'attestationRest',
      '$translate',
      (i, t, n, r, o, s) => {
        let e
        return (
          (i.$root.section = 'attestation'),
          (i.$root.pageTitle = s.instant('Аттестация')),
          (e = () => {
            let e
            return r(
              o.load(null != (e = n.getStudent()) ? e.id : void 0),
              i
            ).then(
              (e) => {
                let o
                let t
                let n
                let r
                let s
                let a
                for (
                  i.terms = [],
                    s = [],
                    t = 0,
                    n = (r = _.extend(i, e.data).academicYears).length;
                  t < n;
                  t++
                )
                  (o = r[t]),
                    s.push(
                      (() => {
                        for (
                          let e = o.terms, t = [], n = 0, r = e.length;
                          n < r;
                          n++
                        )
                          (a = e[n]),
                            o.isActive || (o.isActive = a.isActive),
                            t.push(
                              i.terms.push({
                                id: a.id,
                                yearNumber: o.number,
                                termNumber: a.number,
                                termType: o.termType,
                                isActive: a.isActive,
                                subjects: _.filter(
                                  i.subjects,
                                  (e) => null != e.marks[a.id]
                                )
                              })
                            )
                        return t
                      })()
                    )
                return s
              },
              (e) => t.errorBox(s.instant('Ошибка загрузки итоговых оценок'), e)
            )
          })(),
          i.$on('studentChanged', e)
        )
      }
    ]),
  angular
    .module('app.students.attestation.filters', [])
    .filter('shortTermType', [
      'termTypes',
      (e) => {
        const n = new Object()
        return (
          (n[e.semester] = 'сем.'),
          (n[e.trimester] = 'трим.'),
          (e) => {
            let t
            return null != (t = n[e]) ? t : e
          }
        )
      }
    ])
    .filter('skipCourses', [
      'termTypes',
      (t) => (e) => _.filter(e, (e) => e.termType !== t.course)
    ]),
  angular
    .module('app.students.attestation.services.rest', [])
    .service('attestationRest', [
      '$http',
      'tv4Promise',
      (t, n) => ({
        load: (e) =>
          t
            .get(`/services/students/${e}/attestation`)
            .then(
              n({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                additionalProperties: !1,
                required: ['academicYears', 'subjects'],
                properties: {
                  academicYears: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: !1,
                      required: ['id', 'number', 'termType', 'terms'],
                      properties: {
                        id: { type: 'integer' },
                        number: { type: 'integer' },
                        termType: { type: 'string' },
                        terms: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: !1,
                            required: ['id', 'number', 'isActive'],
                            properties: {
                              id: { type: 'integer' },
                              number: { type: 'integer' },
                              isActive: { type: 'boolean' }
                            }
                          }
                        }
                      }
                    }
                  },
                  subjects: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['name', 'marks', 'finalMark'],
                      properties: {
                        name: { type: 'string' },
                        marks: { type: 'object' },
                        finalMark: {
                          type: 'object',
                          additionalProperties: !1,
                          properties: { value: { type: 'string' } }
                        }
                      }
                    }
                  }
                }
              })
            )
      })
    ]),
  angular.module('app.students.attestation.services.rest.mock', []),
  angular
    .module('app.students.chats', [
      'app.students.chats.controllers',
      'app.students.chats.services.rest'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e.when('/chats', {
          templateUrl: 'app/students/chats/view.chats.pug',
          controller: 'Students.Chats.View'
        })
    ]),
  angular
    .module('app.students.chats.controllers', [])
    .controller('Students.Chats.View', [
      '$scope',
      'busyPromise',
      'chatsRest',
      'chatService',
      'chatTypes',
      (t, e, n, r, o) => (
        console.log('controller in'),
        (t.$root.pageTitle = 'Чаты'),
        (t.communicationSettingsAreSet = !1),
        e(n.checkVKCommunicationSettings(), t).then(
          (e) => (
            (t.communicationSettingsAreSet = e.data),
            console.log(
              'communicationSettingsAreSet',
              e,
              t.communicationSettingsAreSet
            )
          ),
          (e) =>
            $liteBox.errorBox(
              'Произошла ошибка загрузки информации о настройках коммуникационной среды',
              e
            )
        ),
        e(n.getVkEduProfile(), t).then(
          (e) => (
            (t.vkEduProfile = e.data),
            console.log('vkEduProfile', e, t.vkEduProfile)
          ),
          (e) =>
            $liteBox.errorBox(
              'Произошла ошибка загрузки информации о ВК профиле',
              e
            )
        ),
        e(n.loadChatsForCurrentUser(), t).then(
          (e) => (
            (t.chats = e.data),
            console.log('loadChatsForCurrentUser chats=', t.chats)
          ),
          (e) =>
            $liteBox.errorBox(
              'Произошла ошибка загрузки информации о чатах пользователя',
              e
            )
        ),
        _.extend(t, {
          ip: '',
          linkVKProfile: () => r.linkVKProfile(n, t, r),
          goVKMessenger: () => (
            console.log('goVKMessenger'),
            e(n.getVkEduProfile(), t).then(
              (e) => {
                const t = e.data
                if ((console.log('vkEduProfile', e, t), null != t))
                  return r.windowOpen({
                    url: 'https://web.vk.me/',
                    name: '_blank'
                  })
              },
              (e) =>
                $liteBox.errorBox(
                  'Произошла ошибка загрузки информации о ВК профиле',
                  e
                )
            )
          ),
          unlinkVkEduProfile: () => r.unlinkVkEduProfile(n, t),
          isVkEduProfileDefined: () =>
            null != t.vkEduProfile && !_.isEmpty(t.vkEduProfile.toString()),
          isShowChatManagementButton: () => !1,
          showChatAdmins: (e) => null !== e.adminName && '' !== e.adminName,
          getChatCssClassName: (e) => {
            switch (e.chatType) {
              case o.teacherChat:
                return 'chat_box_teacher'
              case o.groupChat:
                return 'chat_box_group'
              case o.parentChat:
                return 'chat_box_parents'
              case o.subjectChat:
                return 'chat_box_subject'
            }
          }
        })
      )
    ]),
  angular
    .module('app.students.chats.services.rest', [])
    .service('chatsRest', [
      '$http',
      (t) => ({
        getIp: () =>
          t
            .get('https://www.cloudflare.com/cdn-cgi/trace')
            .then((e) => e.data.trim().split('\n')[2].split('=')[1]),
        getVkAccessData: (e) => (
          console.log('getVkAccessData', e),
          t.get('/integration/vk/access-data', { params: { ip: e.ip } })
        ),
        checkVKCommunicationSettings: () =>
          t.get('/integration/vk/checkCommunicationSettings'),
        getVkEduProfile: () => t.get('/integration/vk/edu-profile'),
        unlinkVkEduProfile: () => t.post('/integration/vk/edu-profile/unlink'),
        loadChatsForCurrentUser: () =>
          t.get('/integration/chatManagement/chats/current')
      })
    ]),
  angular
    .module('app.students.dashboard.controllers', [])
    .controller('Students.Dashboard.View', [
      '$scope',
      '$liteBox',
      'studentSelector',
      'busyPromise',
      'dashboardRest',
      'organizationRest',
      (t, n, r, o, s, e) => {
        let a
        return (
          (t.$root.section = 'dashboard'),
          (t.$root.pageTitle = 'Главная'),
          (a = () => {
            let e
            return o(
              s.load(null != (e = t.student = r.getStudent()) ? e.id : void 0),
              t
            ).then(
              (e) => (
                (t.bestSubjects = _.chain(e.data.subjects)
                  .filter((e) => 4 <= e.mark)
                  .take(10)
                  .value()),
                (t.worstSubjects = _.chain(e.data.subjects)
                  .filter((e) => e.mark < 4)
                  .reverse()
                  .take(10)
                  .value())
              ),
              (e) => n.errorBox('Ошибка загрузки главной страницы', e)
            )
          })(),
          t.$on('studentChanged', a),
          o(e.loadLastNews(5), t).then(
            (e) => (t.news = e.data),
            (e) => n.errorBox('Ошибка загрузки объявлений', e)
          )
        )
      }
    ]),
  angular
    .module('app.students.dashboard', [
      'app.students.dashboard.controllers',
      'app.students.dashboard.services.rest',
      'app.students.dashboard.services.rest.mock'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e.when('/', {
          templateUrl: 'app/students/dashboard/view.dashboard.pug',
          controller: 'Students.Dashboard.View'
        })
    ]),
  angular
    .module('app.students.dashboard.services.rest', [])
    .service('dashboardRest', [
      '$http',
      'tv4Promise',
      (t, n) => ({
        load: (e) =>
          t
            .get(`/services/students/${e}/dashboard`)
            .then(
              n({
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object'
              })
            )
      })
    ]),
  angular.module('app.students.dashboard.services.rest.mock', []),
  angular
    .module('app.students.employment.controllers', [])
    .controller('Students.Employment.View', [
      '$scope',
      'busyPromise',
      (e, t) => {
        let n
        return (
          console.log('controller in'),
          (e.$root.pageTitle = 'Трудоустройство'),
          _.extend(e, {
            goEmployment: () => (
              console.log('goEmployment'),
              n({
                url: 'https://rabota.yanao.ru/content/%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%BE_%D0%BA%D0%B0%D1%80%D1%8C%D0%B5%D1%80%D1%8B',
                name: '_blank'
              })
            )
          }),
          (n = (e) => {
            let t
            let n
            let r
            let o
            let s
            let a
            for (
              console.log('windowOpen', e),
                s = e.url || '',
                t = e.name || '',
                o = e.specs || '',
                (a = e.winChild) && !a.closed && a.close(),
                a = window.open(s, t, o),
                n = (e.winChild = a).opener,
                r = [];
              n && !n.closed;
            )
              try {
                n.childWindows.push(a), r.push((n = n.opener))
              } catch (e) {
                0
                break
              }
            return r
          })
        )
      }
    ]),
  angular
    .module('app.students.employment', ['app.students.employment.controllers'])
    .config([
      '$routeProvider',
      (e) =>
        e.when('/employment', {
          templateUrl: 'app/students/employment/view.employment.pug',
          controller: 'Students.Employment.View'
        })
    ]),
  angular
    .module('app.students.lessons.controllers', [])
    .controller('Students.Lessons.View', [
      '$scope',
      '$liteBox',
      '$filter',
      'studentSelector',
      'busyPromise',
      'busyPromiseWithParams',
      'lessonsRest',
      'organizationRest',
      'gradebookMeetingsRest',
      'chatService',
      'errors',
      '$translate',
      (c, l, d, t, n, p, r, e, f, o, s, m) => (
        (c.$root.section = 'lessons'),
        (c.$root.pageTitle = m.instant('Занятия и оценки')),
        n(e.loadSystemInfo(), c).then(
          (e) => {
            let t
            return (
              (c.areChatsEnabled =
                null != e && null != (t = e.data) ? t.areChatsEnabled : void 0),
              console.log('result?.data', null != e ? e.data : void 0)
            )
          },
          (e) =>
            l.errorBox(
              m.instant('Произошла ошибка загрузки информации о системе'),
              e
            )
        ),
        _.extend(c, !1, {
          currentWeek: () => (c.startDate = moment().startOf('week')),
          previousWeek: () =>
            (c.startDate = moment(c.startDate).add({ week: -1 })),
          nextWeek: () => (c.startDate = moment(c.startDate).add({ week: 1 })),
          expandLesson: (e) => {
            if (!c.meetingOpening) return (e.expanded = !e.expanded)
          },
          openMeeting: (e) => {
            if (
              ((c.meetingOpening = !0),
              setTimeout(() => (c.meetingOpening = !1), 300),
              console.log('openMeeting', e),
              e.gradebook.meetingId)
            )
              return n(f.joinMeeting(e.gradebook.meetingId), c).then(
                (e) => (
                  console.log('openMeeting', e.data),
                  (e = { url: e.data.meetingUrl, name: '_blank' }),
                  o.windowOpen(e)
                ),
                (e) => l.warningBox(s.getRestError(e), e)
              )
          }
        }),
        c.currentWeek(),
        c.$watch('startDate', (e) => (c.endDate = moment(e).endOf('week'))),
        c.$watch(
          'endDate',
          (e = () => {
            let e
            return n(
              r.load(
                null != (e = t.getStudent()) ? e.id : void 0,
                c.startDate,
                c.endDate
              ),
              c
            ).then(
              (o) => {
                let s
                let a
                let e
                let t
                let i
                let u
                let n
                let r
                if (((c.week = d('trimWeek')(o.data)), c.areChatsEnabled)) {
                  for (
                    n = c.week, r = [], a = e = 0, t = n.length;
                    e < t;
                    a = ++e
                  )
                    (s = n[a]),
                      r.push(
                        (() => {
                          let e
                          let t
                          const n = s.lessons
                          const r = []
                          for (u = e = 0, t = n.length; e < t; u = ++e)
                            null != (i = n[u]).gradebook
                              ? r.push(
                                  p(f.getMeeting(i.gradebook.id), c, a, u).then(
                                    (e) => {
                                      let t
                                      return (
                                        (o = e.promiseResonse),
                                        (t = e.param1),
                                        (e = e.param2),
                                        _.isUndefined(o.data.meetingId)
                                          ? _.extend(
                                              c.week[t].lessons[e].gradebook,
                                              { meetingId: null }
                                            )
                                          : _.extend(
                                              c.week[t].lessons[e].gradebook,
                                              o.data
                                            )
                                      )
                                    },
                                    (e) =>
                                      l.errorBox(
                                        m.instant('Ошибка загрузки данных.'),
                                        e
                                      )
                                  )
                                )
                              : r.push(void 0)
                          return r
                        })()
                      )
                  return r
                }
              },
              (e) => l.errorBox(m.instant('Ошибка загрузки занятий'), e)
            )
          })
        ),
        c.$on('studentChanged', e)
      )
    ])
    .controller('Students.Timetable.View', [
      '$scope',
      '$liteBox',
      '$filter',
      'studentSelector',
      'busyPromise',
      'lessonsRest',
      '$translate',
      (u, t, c, n, r, o, s) => {
        let e
        return (
          (u.$root.section = 'timetable'),
          (u.$root.pageTitle = s.instant('Расписание занятий')),
          _.extend(u, {
            currentWeek: () => (u.startDate = moment().startOf('week')),
            previousWeek: () =>
              (u.startDate = moment(u.startDate).add({ week: -1 })),
            nextWeek: () => (u.startDate = moment(u.startDate).add({ week: 1 }))
          }),
          u.currentWeek(),
          u.$watch(
            'startDate',
            (e) => (u.endDate = moment(e).add({ week: 1 }).endOf('week'))
          ),
          u.$watch(
            'endDate',
            (e = () => {
              let e
              return r(
                o.load(
                  null != (e = n.getStudent()) ? e.id : void 0,
                  u.startDate,
                  u.endDate
                ),
                u
              ).then(
                (e) => {
                  for (
                    let t,
                      n = [],
                      r = void 0,
                      o = void 0,
                      s = e.data,
                      a = 0,
                      i = s.length;
                    a < i;
                    a++
                  )
                    ((t = s[a]).date = moment(t.date)),
                      t.date.week() !== r
                        ? ((r = t.date.week()), n.push((o = [t])))
                        : o.push(t)
                  return (u.weeks = _.chain(n)
                    .map((e) => c('trimWeek')(e))
                    .filter((e) => !_.isEmpty(e))
                    .value())
                },
                (e) => t.errorBox(s.instant('Ошибка загрузки занятий'), e)
              )
            })
          ),
          u.$on('studentChanged', e)
        )
      }
    ]),
  angular
    .module('app.students.lessons.filters', [])
    .filter('educationTaskTypeShort', [
      'educationTaskTypes',
      (e) => {
        const n = new Object()
        return (
          (n[e.lesson] = 'ОЗ'),
          (n[e.control] = 'КР'),
          (n[e.independent] = 'СР'),
          (n[e.laboratory] = 'ЛЗ'),
          (n[e.slice] = 'СЗ'),
          (n[e.home] = 'ДЗ'),
          (n[e.review] = 'РФ'),
          (n[e.test] = 'ТТ'),
          (n[e.report] = 'ДК'),
          (n[e.colloquium] = 'КЛ'),
          (e) => {
            let t
            return null != (t = n[e]) ? t : e
          }
        )
      }
    ])
    .filter('educationTaskTypeStyle', [
      'educationTaskTypes',
      (e) => {
        const n = new Object()
        return (
          (n[e.lesson] = null),
          (n[e.control] = null),
          (n[e.independent] = null),
          (n[e.laboratory] = null),
          (n[e.slice] = null),
          (n[e.home] = 'homework'),
          (n[e.review] = null),
          (n[e.test] = null),
          (n[e.report] = null),
          (n[e.colloquium] = null),
          (e) => {
            let t
            return null != (t = n[e]) ? t : e
          }
        )
      }
    ])
    .filter('attendance', [
      'absenceTypes',
      (n) => (e, t) => {
        if (null != e && !moment().isBefore(t))
          switch (e.absenceType) {
            case n.isAbsentByValidReason:
              return 'isAbsentByValidReason'
            case n.isAbsentByNotValidReason:
              return 'isAbsentByNotValidReason'
            case n.sickLeave:
              return 'sickLeave'
            case n.isLate:
              return 'late'
            default:
              return 'attended'
          }
        return null
      }
    ])
    .filter('trimWeek', () => (e) => {
      let t
      return _.isArray(e) &&
        -1 !== (t = _.findIndex(e, (e) => !_.isEmpty(e.lessons)))
        ? e.slice(t, 1 + _.findLastIndex(e, (e) => !_.isEmpty(e.lessons)))
        : []
    }),
  angular
    .module('app.students.lessons', [
      'app.students.lessons.controllers',
      'app.students.lessons.filters',
      'app.students.lessons.services.rest',
      'app.students.lessons.services.rest.mock'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e
          .when('/lessons', {
            templateUrl: 'app/students/lessons/view.lessons.pug',
            controller: 'Students.Lessons.View'
          })
          .when('/timetable', {
            templateUrl: 'app/students/lessons/view.timetable.pug',
            controller: 'Students.Timetable.View'
          })
    ]),
  angular
    .module('app.students.lessons.services.rest', [])
    .service('lessonsRest', [
      '$http',
      'tv4Promise',
      'classroomSchema',
      'idPersonNameSchema',
      (r, e, t, n) => ({
        load: (e, t, n) =>
          r.get(
            `/services/students/${e}/lessons/${moment(t).format('YYYY-MM-DD')}/${moment(n).format('YYYY-MM-DD')}`
          )
      })
    ])
    .service('gradebookMeetingsRest', [
      '$http',
      (t) => ({
        getMeeting: (e) => t.get(`/integration/meetings/${e}`),
        joinMeeting: (e) => t.post(`/integration/meetings/${e}`)
      })
    ]),
  angular.module('app.students.lessons.services.rest.mock', []),
  angular
    .module('app.students.reports.controllers', [])
    .controller('Students.PerformanceReport.View', [
      '$scope',
      '$liteBox',
      '$filter',
      '$export',
      'busyPromise',
      'performanceReportRest',
      'studentSelector',
      'session',
      'absenceTypes',
      'markRatings',
      (C, t, e, n, r, o, B, s, a, i) => {
        let A
        let u
        let R
        return (
          (C.$root.pageTitle = 'Текущая успеваемость'),
          (u = (e) =>
            t.errorBox('Произошла ошибка получения текущей успеваемости', e)),
          _.extend(C, {
            report: null,
            allowExport: !0,
            export: () => {
              let e
              return n.download('/services/reports/current/performance', {
                date: C.report.date,
                studentWorkFlowId: null != (e = B.getStudent()) ? e.id : void 0
              })
            }
          }),
          (A = (e) => {
            switch (e) {
              case i.two:
                return 2
              case i.three:
                return 3
              case i.four:
                return 4
              case i.five:
                return 5
              default:
                return 1
            }
          }),
          (R = (e) => (
            e.absenceType === a.isAbsentByValidReason && (e.value = 'уп'),
            e.absenceType === a.isAbsentByNotValidReason && (e.value = 'нп'),
            e.absenceType === a.sickLeave && (e.value = 'б'),
            '' === e.value
              ? (e.value = e.marks)
              : '' !== e.marks
                ? (e.value = `${e.value},${e.marks}`)
                : void 0
          )),
          (() => {
            let e
            return (
              console.log('studentSelector.getStudent() =', B.getStudent()),
              r(o.load(null != (e = B.getStudent()) ? e.id : void 0), C).then(
                (e) => {
                  let t
                  let n
                  let r
                  let o
                  let s
                  let a
                  let i
                  let u
                  let c
                  let l
                  let d
                  let p
                  let f
                  let m
                  let g
                  let h
                  let v
                  let y
                  let b
                  let k
                  let S
                  let w
                  let $
                  let x
                  let T
                  let P
                  for (
                    C.report = _.extend(e.data, {
                      date: moment(),
                      student: B.getStudent()
                    }),
                      console.log('report', C.report),
                      C.days = [],
                      o = 0,
                      u = (v = C.report.monthsWithDays).length;
                    o < u;
                    o++
                  )
                    for (
                      s = 0, c = (y = v[o].daysWithLessons).length;
                      s < c;
                      s++
                    )
                      (t = y[s]), C.days.push(t)
                  for (
                    C.reportRows = [],
                      $ = [],
                      a = 0,
                      l = (b = C.report.daysWithMarksForSubject).length;
                    a < l;
                    a++
                  ) {
                    for (
                      x = {
                        subject: (P = b[a]).subjectName,
                        days: [],
                        averageMark: ''
                      },
                        r = [],
                        i = 0,
                        d = (k = C.days).length;
                      i < d;
                      i++
                    ) {
                      for (
                        T = {
                          day: (t = k[i]),
                          absenceType: null,
                          marks: '',
                          value: ''
                        },
                          m = 0,
                          p = (S = P.daysWithMarks).length;
                        m < p;
                        m++
                      )
                        if (((n = S[m]), Date.parse(n.day) === Date.parse(t))) {
                          for (
                            _.isUndefined(n.absenceType) ||
                              (T.absenceType = n.absenceType),
                              h = 0,
                              f = (w = n.markValues).length;
                            h < f;
                            h++
                          )
                            (g = w[h]),
                              (T.marks =
                                '' === T.marks ? A(g) : `${T.marks},${A(g)}`)
                          R(T)
                        }
                      r.push(T)
                    }
                    ;(x.days = r),
                      P.hasOwnProperty('averageMark') &&
                        (x.averageMark = P.averageMark),
                      $.push(C.reportRows.push(x))
                  }
                  return $
                },
                u
              )
            )
          })()
        )
      }
    ])
    .controller('Students.GroupAttestation.View', [
      '$scope',
      '$liteBox',
      '$filter',
      '$export',
      'busyPromise',
      'groupAttestationReportRest',
      'examinationTypes',
      'session',
      'studentSelector',
      (a, t, i, n, r, o, s, e, u) => {
        let c
        let l
        return (
          (a.$root.pageTitle = 'Ведомость успеваемости'),
          (l = (e) =>
            t.errorBox(
              'Произошла ошибка получения сводной ведомости успеваемости по группе',
              e
            )),
          (c = _.reduce(
            [
              s.exam,
              s.differentiatedTest,
              s.test,
              s.other,
              s.courseWork,
              s.professionalModule
            ],
            (e, t, n) => ((e[t] = n), e),
            new Object()
          )),
          _.extend(a, {
            report: null,
            export: () => {
              let e
              let o
              let s
              return n.download(
                '/services/reports/curator/group-attestation-for-student',
                {
                  date: a.report.date,
                  academicYear: i('educationYear')(a.report.year),
                  academicPeriod: i('academicTermTitle')(
                    a.report.termNumber,
                    a.report.termType
                  ),
                  department: a.report.departmentName,
                  studentGroup: a.report.student.groupName,
                  examinationTypes: (() => {
                    for (
                      let e = a.report.examinationTypes,
                        t = [],
                        n = 0,
                        r = e.length;
                      n < r;
                      n++
                    )
                      (s = e[n]),
                        t.push({
                          name: i('pluralExaminationType')(s.examinationType),
                          count: s.count
                        })
                    return t
                  })(),
                  subjects: (() => {
                    for (
                      let e = a.report.subjects, t = [], n = 0, r = e.length;
                      n < r;
                      n++
                    )
                      (o = e[n]),
                        t.push({
                          id: o.id,
                          name: o.name,
                          teacher: o.teacher,
                          marks: _.reduce(
                            _.keys(o.marks),
                            (e, t) => (
                              (e[t] = {
                                value: i('markLong')(o.marks[t].value, '-')
                              }),
                              e
                            ),
                            new Object()
                          )
                        })
                    return t
                  })(),
                  students: a.report.students,
                  studentWorkFlowId:
                    null != (e = u.getStudent()) ? e.id : void 0
                }
              )
            }
          }),
          (() => {
            let e
            return (
              console.log('studentSelector.getStudent() =', u.getStudent()),
              r(o.load(null != (e = u.getStudent()) ? e.id : void 0), a).then(
                (e) => (
                  (a.allowExport = !_.any(
                    [e.data.students, e.data.subjects],
                    _.isEmpty
                  )),
                  (a.report = _.chain(e.data.subjects)
                    .concat(
                      _.forEach(
                        e.data.profModules,
                        (e) => (e.examinationType = s.professionalModule)
                      )
                    )
                    .concat(
                      _.forEach(
                        e.data.courseWorks,
                        (e) => (e.examinationType = s.courseWork)
                      )
                    )
                    .groupBy('examinationType')
                    .sortBy((e, t) => c[t])
                    .reduce(
                      (e, t) => {
                        for (
                          let n,
                            r = void 0,
                            o = i('orderBy')(t, 'name'),
                            s = 0,
                            a = o.length;
                          s < a;
                          s++
                        )
                          (n = o[s]),
                            null != r
                              ? r.count++
                              : e.examinationTypes.push(
                                  (r = {
                                    examinationType: n.examinationType,
                                    count: 1
                                  })
                                ),
                            e.subjects.push(n)
                        return e
                      },
                      {
                        date: moment(),
                        student: u.getStudent(),
                        students: e.data.students,
                        examinationTypes: [],
                        subjects: [],
                        termType: e.data.termType,
                        termNumber: e.data.termNumber,
                        year: e.data.year,
                        departmentName: e.data.departmentName
                      }
                    )
                    .value()),
                  console.log('after load', a.report)
                ),
                l
              )
            )
          })()
        )
      }
    ]),
  angular
    .module('app.students.reports', [
      'app.students.reports.controllers',
      'app.students.reports.services.rest'
    ])
    .config([
      '$routeProvider',
      (e) =>
        e
          .when('/reports/performance', {
            templateUrl: 'app/students/reports/performance-report.pug',
            controller: 'Students.PerformanceReport.View'
          })
          .when('/reports/attestation', {
            templateUrl: 'app/students/reports/group-attestation.pug',
            controller: 'Students.GroupAttestation.View'
          })
    ]),
  angular
    .module('app.students.reports.services.rest', [])
    .service('performanceReportRest', [
      '$http',
      'tv4Promise',
      'schemaHelper',
      'idNameSchema',
      (t, n, e, r) => {
        const o = {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          additionalProperties: !1,
          required: ['monthsWithDays', 'daysWithMarksForSubject'],
          properties: {
            monthsWithDays: { type: 'array' },
            daysWithMarksForSubject: { type: 'array' }
          }
        }
        return {
          load: (e) => (
            console.log('load studentWorkFlowId=', e),
            t.get(`/services/reports/current/performance/${e}`).then(n(o))
          )
        }
      }
    ])
    .service('groupAttestationReportRest', [
      '$http',
      'tv4Promise',
      'schemaHelper',
      'idPersonNameSchema',
      'idNameSchema',
      'markRatings',
      (t, n, r, o, s, a) => ({
        load: (e) =>
          t
            .get(`/services/reports/curator/group-attestation-for-student/${e}`)
            .then(
              n({
                type: 'object',
                additionalProperties: !0,
                required: [
                  'students',
                  'subjects',
                  'profModules',
                  'termType',
                  'termNumber',
                  'year',
                  'departmentName'
                ],
                properties: {
                  students: { type: 'array', items: o },
                  subjects: {
                    type: 'array',
                    items: r.union(s, {
                      required: ['examinationType', 'marks'],
                      properties: {
                        examinationType: { type: 'string' },
                        marks: {
                          type: 'object',
                          additionalProperties: !1,
                          patternProperties: {
                            '^\\d+$': {
                              type: 'object',
                              additionalProperties: !1,
                              properties: { value: _.values(a) }
                            }
                          }
                        },
                        teacher: o
                      }
                    })
                  },
                  termType: 'string',
                  termNumber: 'integer',
                  year: 'integer',
                  departmentName: 'string',
                  profModules: {
                    type: 'array',
                    items: r.union(s, {
                      required: ['marks'],
                      properties: {
                        marks: {
                          type: 'object',
                          additionalProperties: !1,
                          patternProperties: {
                            '^\\d+$': {
                              type: 'object',
                              additionalProperties: !1,
                              properties: { value: _.values(a) }
                            }
                          }
                        }
                      }
                    })
                  },
                  courseWorks: {
                    type: 'array',
                    items: r.union(s, {
                      required: ['marks'],
                      properties: {
                        marks: {
                          type: 'object',
                          additionalProperties: !1,
                          patternProperties: {
                            '^\\d+$': {
                              type: 'object',
                              additionalProperties: !1,
                              properties: { value: _.values(a) }
                            }
                          }
                        },
                        teacher: o
                      }
                    })
                  }
                }
              })
            )
      })
    ])

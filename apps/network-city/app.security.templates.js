angular.module('app.security.templates', []).run([
  '$templateCache',
  ($templateCache) => {
    $templateCache.put(
      'app/security/login/view.authentication.pug',
      '\n<div class="loginbox" x-appear="x-appear">\n  <h1>&laquo;{{systemTitle}}&raquo;<small>{{\'LOGIN.\u041C\u043E\u0434\u0443\u043B\u044C_\u041F\u041E\u041E\' | translate}}</small></h1>\n  <form name="formAuth" novalidate="novalidate" x-ng-submit="authenticate(formAuth)" form-autofill-fix="form-autofill-fix">\n    <div class="login-error icon-warning" x-ng-show="formAuth.$invalid &amp;&amp; formAuth.$submitted">\n      <label x-ng-show="formAuth.login.$error.required || formAuth.password.$error.required">{{\'LOGIN.\u0412\u0432\u0435\u0434\u0438\u0442\u0435_\u043B\u043E\u0433\u0438\u043D_\u0438_\u043F\u0430\u0440\u043E\u043B\u044C\' | translate}}</label>\n      <label x-ng-show="formAuth.$error.rest">{{ formAuth.$error.rest.message }}</label>\n    </div>\n    <div class="input-field input-field_user">\n      <input id="login" type="text" name="login" translate-attr="{placeholder : \'LOGIN.\u043B\u043E\u0433\u0438\u043D\'}" required="required" maxlength="16" autofocus="autofocus" x-ng-disabled="$busy" x-ng-model="credentials.login"/>\n    </div>\n    <div class="input-field input-field_password">\n      <input id="password" type="password" name="password" translate-attr="{placeholder : \'LOGIN.\u043F\u0430\u0440\u043E\u043B\u044C\'}" required="required" x-ng-disabled="$busy" x-ng-model="credentials.password"/>\n    </div>\n    <button class="huge" id="loginButton" type="submit" x-ng-disabled="$busy">{{\'LOGIN.\u0412\u043E\u0439\u0442\u0438\' | translate}}</button>\n    <div class="entrance-portal-wrapper">\n      <div x-ng-show="isEsiaAvailable"><a x-ng-click="loginWithEsia()">{{\'LOGIN.\u0412\u043E\u0439\u0442\u0438_\u0447\u0435\u0440\u0435\u0437_\u043F\u043E\u0440\u0442\u0430\u043B_\u0433\u043E\u0441_\u0443\u0441\u043B\u0443\u0433\' | translate}}</a></div>\n    </div>\n    <p></p>\n    <div class="fclear" style="overflow:hidden">\n      <div class="fleft">\n        <label>\n          <input type="checkbox" ng-model="credentials.isRemember"/>&nbsp;{{\'LOGIN.\u0417\u0430\u043F\u043E\u043C\u043D\u0438\u0442\u044C_\u043C\u0435\u043D\u044F\' | translate}}\n        </label>\n      </div>\n      <div class="fright"><a href="#/forgot">{{\'LOGIN.\u0417\u0430\u0431\u044B\u043B\u0438_\u0441\u0432\u043E\u0439_\u043F\u0430\u0440\u043E\u043B\u044C\' | translate}}</a></div>\n    </div>\n  </form>\n  <div class="mtop">\n    <div class="copyright">{{\'LOGIN.\u0410\u0418\u0421_\u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430_\u0410\u041E\' | translate}} &laquo;\u0418\u0420\u0422\u0435\u0445&raquo;, {{\'LOGIN.\u0433_\u0421\u0430\u043C\u0430\u0440\u0430\' | translate}}<br> &copy; 2013-2024, {{\'LOGIN.\u0412\u0441\u0435_\u043F\u0440\u0430\u0432\u0430_\u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B\' | translate}}<small x-ng-if="version">{{\'LOGIN.\u0412\u0435\u0440\u0441\u0438\u044F\' | translate}} {{ version }}</small></div>\n  </div>\n</div>'
    )
    $templateCache.put(
      'app/security/login/view.esia-error.pug',
      '\n<div class="loginbox" x-appear="x-appear">\n  <h1>&laquo;\u0421\u0435\u0442\u0435\u0432\u043E\u0439 \u0433\u043E\u0440\u043E\u0434. \u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435&raquo;<small>\u041C\u043E\u0434\u0443\u043B\u044C \u041F\u041E\u041E</small></h1>\n  <h4>\u0412\u0445\u043E\u0434 \u0447\u0435\u0440\u0435\u0437 \u043F\u043E\u0440\u0442\u0430\u043B \u0433\u043E\u0441. \u0443\u0441\u043B\u0443\u0433</h4>\n  <div>\n    <p class="big">\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u0445\u043E\u0434\u0435 \u0447\u0435\u0440\u0435\u0437 \u0443\u0447\u0435\u0442\u043D\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C \u0413\u043E\u0441\u0423\u0441\u043B\u0443\u0433</p><br/><br/><a href="#/login">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443</a>\n  </div>\n  <div class="mtop">\n    <div class="copyright">\u0410\u0418\u0421 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430 \u0410\u041E &laquo;\u0418\u0420\u0422\u0435\u0445&raquo;, \u0433. \u0421\u0430\u043C\u0430\u0440\u0430<br> &copy; 2013-2024, \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B<small x-ng-if="version">\u0412\u0435\u0440\u0441\u0438\u044F {{ version }}</small></div>\n  </div>\n</div>'
    )
    $templateCache.put(
      'app/security/login/view.forgot-password.pug',
      '\n<div class="loginbox" x-appear="x-appear" x-ng-switch="params.isMessageSent">\n  <h1>&laquo;{{systemTitle}}&raquo;<small>\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F</small></h1>\n  <div x-ng-switch-when="true">\u0417\u0430\u043F\u0440\u043E\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u0430\u0448\u0443 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0443\u044E \u043F\u043E\u0447\u0442\u0443 \u0438 \u0441\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C \u0432 \u043F\u0438\u0441\u044C\u043C\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F\u043C \u043F\u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044E \u043F\u0430\u0440\u043E\u043B\u044F.</div>\n  <form name="formForgotPassword" novalidate="novalidate" form-autofill-fix="form-autofill-fix" x-ng-submit="submit(formForgotPassword)" x-ng-switch-default="x-ng-switch-default">\n    <div class="login-error icon-warning" x-ng-show="formForgotPassword.$invalid &amp;&amp; formForgotPassword.$submitted">\n      <label x-ng-show="formForgotPassword.email.$error.required">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u0430\u0448 email \u0430\u0434\u0440\u0435\u0441</label>\n      <label x-ng-show="formForgotPassword.email.$error.email">\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email \u0430\u0434\u0440\u0435\u0441\u0430</label>\n      <label x-ng-show="formForgotPassword.$error.rest">{{ formForgotPassword.$error.rest.message }}</label>\n    </div>\n    <p>\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0451\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438. \u0412\u0430\u043C \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u0438\u0441\u044C\u043C\u043E \u0441 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F\u043C\u0438 \u043F\u043E \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044E \u043F\u0430\u0440\u043E\u043B\u044F.</p>\n    <div class="input-field input-field_email">\n      <input type="email" name="email" placeholder="Email \u0430\u0434\u0440\u0435\u0441" required="required" maxlength="32" autofocus="autofocus" x-ng-disabled="$busy" x-ng-model="params.email"/>\n    </div>\n    <button class="huge" type="submit" x-ng-disabled="$busy">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441</button>\n  </form>\n  <div class="copyright">\u0410\u0418\u0421 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430 \u0410\u041E &laquo;\u0418\u0420\u0422\u0435\u0445&raquo;, \u0433. \u0421\u0430\u043C\u0430\u0440\u0430<br> &copy; 2013-2024, \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B</div>\n</div>'
    )
    $templateCache.put(
      'app/security/login/view.not-found.pug',
      '\n<div class="loginbox" x-appear="x-appear">\n  <h1>&laquo;\u0421\u0435\u0442\u0435\u0432\u043E\u0439 \u0433\u043E\u0440\u043E\u0434. \u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435&raquo;<small>\u041C\u043E\u0434\u0443\u043B\u044C \u041F\u041E\u041E</small></h1>\n  <h4>\u0412\u0445\u043E\u0434 \u0447\u0435\u0440\u0435\u0437 \u043F\u043E\u0440\u0442\u0430\u043B \u0433\u043E\u0441. \u0443\u0441\u043B\u0443\u0433</h4>\n  <div>\n    <p class="big">\u0421 \u0443\u0447\u0451\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u044C\u044E \u043F\u043E\u0440\u0442\u0430\u043B\u0430 \u0433\u043E\u0441. \u0443\u0441\u043B\u0443\u0433 \u043D\u0435 \u0441\u0432\u044F\u0437\u0430\u043D \u043D\u0438 \u043E\u0434\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u044B</p><br/><br/><a href="#/login">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443</a>\n  </div>\n  <div class="mtop">\n    <div class="copyright">\u0410\u0418\u0421 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430 \u0410\u041E &laquo;\u0418\u0420\u0422\u0435\u0445&raquo;, \u0433. \u0421\u0430\u043C\u0430\u0440\u0430<br> &copy; 2013-2024 \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B<small x-ng-if="version">\u0412\u0435\u0440\u0441\u0438\u044F {{ version }}</small></div>\n  </div>\n</div>'
    )
    $templateCache.put(
      'app/security/login/view.reset-password.pug',
      '\n<div class="loginbox" x-ng-class="{appear: tenants !== null }" x-ng-switch="tenants | isEmpty">\n  <h1>&laquo;{{systemTitle}}&raquo;<small>\u041C\u043E\u0434\u0443\u043B\u044C \u041F\u041E\u041E</small></h1>\n  <div x-ng-switch-when="true">\n    <p>\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u0432\u0430\u0448 \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D! \u0421\u043A\u043E\u0440\u0435\u0435 \u0432\u0441\u0435\u0433\u043E, \u0441\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0430\u0440\u043E\u043B\u044F \u0443\u0441\u0442\u0430\u0440\u0435\u043B\u0430 \u0438 \u0443\u0436\u0435 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0430, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441 \u0435\u0449\u0451 \u0440\u0430\u0437. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043D\u0435 \u043F\u043E\u043C\u043E\u0436\u0435\u0442, \u0441\u0432\u044F\u0436\u0438\u0442\u0435\u0441\u044C \u0441 \u043D\u0430\u0448\u0435\u0439 \u0441\u043B\u0443\u0436\u0431\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438.</p><a class="big" href="#/forgot">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F</a>\n  </div>\n  <form name="formResetPassword" novalidate="novalidate" x-ng-switch-default="x-ng-switch-default" x-ng-submit="submit(formResetPassword)">\n    <div class="login-error icon-warning" x-ng-show="formResetPassword.$invalid &amp;&amp; formResetPassword.$submitted">\n      <label x-ng-show="formResetPassword.password.$error.required || formResetPassword.confirmPassword.$error.required">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u0430\u0448 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u0434\u0432\u0430\u0436\u0434\u044B</label>\n      <label x-ng-show="formResetPassword.password.$error.minlength &amp;&amp; !formResetPassword.confirmPassword.$error.required">\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u044C\u0448\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432</label>\n      <label x-ng-show="formResetPassword.confirmPassword.$error.equals">\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044B\u0435 \u0432\u0430\u043C\u0438 \u043F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442</label>\n      <label x-ng-show="formResetPassword.$error.rest">{{ formResetPassword.$error.rest.message }}</label>\n    </div>\n    <p>\u0414\u043B\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0430\u0440\u043E\u043B\u044F \u0432\u0430\u043C \u043D\u0443\u0436\u043D\u043E \u0432\u0432\u0435\u0441\u0442\u0438 \u0435\u0433\u043E \u0434\u0432\u0430\u0436\u0434\u044B, \u0434\u043B\u0438\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435, \u043F\u0430\u0440\u043E\u043B\u044C \u0431\u0443\u0434\u0435\u0442 \u0438\u0437\u043C\u0435\u043D\u0451\u043D \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432\u043E \u0432\u0441\u0435 \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438, \u043A \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u0432\u044B \u0438\u043C\u0435\u0435\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F.</p>\n    <div class="input-field input-field_password">\n      <input type="password" name="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" required="required" autofocus="autofocus" minlength="6" x-ng-disabled="$busy" x-ng-model="params.password"/>\n    </div>\n    <div class="input-field input-field_password">\n      <input type="password" name="confirmPassword" placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" required="required" x-ng-disabled="$busy" x-ng-model="params.confirmPassword" x-equals="params.password"/>\n    </div>\n    <button class="huge" type="submit" x-ng-disabled="$busy">\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C</button>\n    <h5 class="fgwhite">\u0412\u044B \u0438\u043C\u0435\u0435\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F\u043C:</h5>\n    <div class="access-list">\n      <ol>\n        <li x-ng-repeat="tenant in tenants">{{ tenant.settings.organization.shortName }}</li>\n      </ol>\n    </div>\n  </form>\n  <div class="copyright">\u0410\u0418\u0421 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430 \u0410\u041E &laquo;\u0418\u0420\u0422\u0435\u0445&raquo;, \u0433. \u0421\u0430\u043C\u0430\u0440\u0430<br> &copy; 2013-2024, \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B</div>\n</div>'
    )
  }
])

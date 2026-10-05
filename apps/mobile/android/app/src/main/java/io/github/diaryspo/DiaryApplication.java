package io.github.diaryspo;

import android.app.Application;
import android.content.SharedPreferences;
import io.appmetrica.analytics.AppMetrica;
import io.appmetrica.analytics.AppMetricaConfig;
import java.util.HashMap;
import java.util.Map;

public final class DiaryApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        if (!BuildConfig.APPMETRICA_API_KEY.isEmpty()) {
            AppMetricaConfig config = AppMetricaConfig
                .newConfigBuilder(BuildConfig.APPMETRICA_API_KEY)
                .withAdvIdentifiersTracking(false)
                .build();
            AppMetrica.activate(this, config);
            AppMetrica.enableActivityAutoTracking(this);
            reportInstallSourceOnce();
        }
    }

    private void reportInstallSourceOnce() {
        SharedPreferences prefs = getSharedPreferences("diary_spo", MODE_PRIVATE);
        if (prefs.getBoolean("install_source_reported", false)) {
            return;
        }
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("source", BuildConfig.INSTALL_SOURCE);
        AppMetrica.reportEvent("install_source", attributes);
        prefs.edit().putBoolean("install_source_reported", true).apply();
    }
}

package io.github.diaryspo;

import android.app.Application;
import io.appmetrica.analytics.AppMetrica;
import io.appmetrica.analytics.AppMetricaConfig;

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
        }
    }
}

package io.github.diaryspo;

import android.content.Intent;
import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(DiaryCookiesPlugin.class);
        registerPlugin(DiaryNetworkPlugin.class);
        registerPlugin(DiaryCredentialsPlugin.class);
        registerPlugin(DiaryAppIconPlugin.class);
        registerPlugin(DiaryAppearancePlugin.class);
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(
            this,
            new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    if (getBridge() != null && getBridge().getWebView().canGoBack()) {
                        getBridge().getWebView().goBack();
                        return;
                    }

                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // singleTask: без setIntent extras тапа по уведомлению теряются.
        setIntent(intent);
    }
}

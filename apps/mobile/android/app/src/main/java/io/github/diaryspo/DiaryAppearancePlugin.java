package io.github.diaryspo;

import android.content.ComponentCallbacks2;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.util.TypedValue;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DiaryAppearance")
public class DiaryAppearancePlugin extends Plugin {

    private ComponentCallbacks2 configCallbacks;

    @Override
    public void load() {
        configCallbacks =
            new ComponentCallbacks2() {
                @Override
                public void onConfigurationChanged(Configuration newConfig) {
                    JSObject data = new JSObject();
                    data.put("dark", isNightYes(newConfig));
                    notifyListeners("systemDarkChange", data);
                }

                @Override
                public void onLowMemory() {}

                @Override
                public void onTrimMemory(int level) {}
            };
        getContext().registerComponentCallbacks(configCallbacks);
    }

    @Override
    protected void handleOnDestroy() {
        if (configCallbacks != null) {
            getContext().unregisterComponentCallbacks(configCallbacks);
            configCallbacks = null;
        }
        super.handleOnDestroy();
    }

    /** Реальный UI mode Android — WebView prefers-color-scheme часто врёт. */
    @PluginMethod
    public void isSystemDark(PluginCall call) {
        JSObject result = new JSObject();
        result.put(
            "dark",
            isNightYes(getContext().getResources().getConfiguration())
        );
        call.resolve(result);
    }

    private static boolean isNightYes(Configuration config) {
        return (
            (config.uiMode & Configuration.UI_MODE_NIGHT_MASK)
            == Configuration.UI_MODE_NIGHT_YES
        );
    }

    @PluginMethod
    public void getSystemAccent(PluginCall call) {
        try {
            int base;
            int hover;
            int active;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                Resources resources = getContext().getResources();
                Resources.Theme theme = getContext().getTheme();
                // Material You: 600 — насыщенный акцент под кнопки с белым текстом.
                base = resources.getColor(android.R.color.system_accent1_600, theme);
                hover = resources.getColor(android.R.color.system_accent1_700, theme);
                active = resources.getColor(android.R.color.system_accent1_800, theme);
            } else {
                TypedValue value = new TypedValue();
                if (!getContext().getTheme().resolveAttribute(android.R.attr.colorAccent, value, true)) {
                    call.resolve(fallbackResult());
                    return;
                }
                base = value.data;
                hover = darken(base, 0.92f);
                active = darken(base, 0.84f);
            }

            JSObject result = new JSObject();
            result.put("base", toHex(base));
            result.put("hover", toHex(hover));
            result.put("active", toHex(active));
            call.resolve(result);
        } catch (Exception error) {
            call.resolve(fallbackResult());
        }
    }

    /** darkIcons=true → тёмные иконки (светлый фон); false → светлые (тёмный фон). */
    @PluginMethod
    public void setStatusBarIconStyle(PluginCall call) {
        boolean darkIcons = Boolean.TRUE.equals(call.getBoolean("darkIcons", false));
        getActivity().runOnUiThread(() -> {
            try {
                Window window = getActivity().getWindow();
                WindowInsetsControllerCompat controller =
                    WindowCompat.getInsetsController(window, window.getDecorView());
                if (controller != null) {
                    controller.setAppearanceLightStatusBars(darkIcons);
                }
                call.resolve();
            } catch (Exception error) {
                call.reject("Unable to set status bar icons", error);
            }
        });
    }

    private static JSObject fallbackResult() {
        JSObject result = new JSObject();
        result.put("base", "#2688eb");
        result.put("hover", "#2483e4");
        result.put("active", "#237edd");
        return result;
    }

    private static String toHex(int color) {
        return String.format("#%06X", (0xFFFFFF & color));
    }

    private static int darken(int color, float factor) {
        float[] hsv = new float[3];
        Color.colorToHSV(color, hsv);
        hsv[2] = Math.max(0f, Math.min(1f, hsv[2] * factor));
        return Color.HSVToColor(hsv);
    }
}

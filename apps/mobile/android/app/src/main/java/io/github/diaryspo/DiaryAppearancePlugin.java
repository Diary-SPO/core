package io.github.diaryspo;

import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.util.TypedValue;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DiaryAppearance")
public class DiaryAppearancePlugin extends Plugin {

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

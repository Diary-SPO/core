package io.github.diaryspo;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Смена иконки через activity-alias: один MainActivity, разные ярлыки. */
@CapacitorPlugin(name = "DiaryAppIcon")
public class DiaryAppIconPlugin extends Plugin {
    private static final String PREFS = "diary_app_icon";
    private static final String PREF_ICON = "iconId";
    private static final String DEFAULT_ALIAS = "io.github.diaryspo.MainActivityDefault";
    private static final String ALT_ALIAS = "io.github.diaryspo.MainActivityAlt";

    @PluginMethod
    public void getOptions(PluginCall call) {
        JSArray options = new JSArray();
        options.put(option("default", "Классическая"));
        options.put(option("alt", "Тёмная"));
        JSObject result = new JSObject();
        result.put("options", options);
        result.put("supported", true);
        call.resolve(result);
    }

    @PluginMethod
    public void getCurrent(PluginCall call) {
        String iconId = getContext()
                .getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)
                .getString(PREF_ICON, "default");
        JSObject result = new JSObject();
        result.put("iconId", iconId);
        call.resolve(result);
    }

    @PluginMethod
    public void setIcon(PluginCall call) {
        String iconId = call.getString("iconId", "default");
        if (!"default".equals(iconId) && !"alt".equals(iconId)) {
            call.reject("Unknown iconId");
            return;
        }

        PackageManager pm = getContext().getPackageManager();
        boolean useAlt = "alt".equals(iconId);
        setAliasEnabled(pm, DEFAULT_ALIAS, !useAlt);
        setAliasEnabled(pm, ALT_ALIAS, useAlt);

        getContext()
                .getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)
                .edit()
                .putString(PREF_ICON, iconId)
                .apply();

        JSObject result = new JSObject();
        result.put("iconId", iconId);
        call.resolve(result);
    }

    private void setAliasEnabled(PackageManager pm, String alias, boolean enabled) {
        ComponentName component = new ComponentName(getContext(), alias);
        pm.setComponentEnabledSetting(
                component,
                enabled
                        ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                        : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);
    }

    private JSObject option(String id, String name) {
        JSObject item = new JSObject();
        item.put("id", id);
        item.put("name", name);
        return item;
    }
}

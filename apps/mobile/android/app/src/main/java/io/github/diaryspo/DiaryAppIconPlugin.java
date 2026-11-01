package io.github.diaryspo;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.LinkedHashMap;
import java.util.Map;

/** Смена иконки через activity-alias: один MainActivity, разные ярлыки. */
@CapacitorPlugin(name = "DiaryAppIcon")
public class DiaryAppIconPlugin extends Plugin {
    private static final String PREFS = "diary_app_icon";
    private static final String PREF_ICON = "iconId";
    private static final Map<String, String> ALIASES = createAliases();

    private static Map<String, String> createAliases() {
        Map<String, String> aliases = new LinkedHashMap<>();
        aliases.put("default", "io.github.diaryspo.MainActivityDefault");
        aliases.put("simka", "io.github.diaryspo.MainActivitySimka");
        aliases.put("simka-throne", "io.github.diaryspo.MainActivitySimkaThrone");
        aliases.put("simka-01", "io.github.diaryspo.MainActivitySimka01");
        aliases.put("simka-02", "io.github.diaryspo.MainActivitySimka02");
        aliases.put("simka-03", "io.github.diaryspo.MainActivitySimka03");
        aliases.put("simka-04", "io.github.diaryspo.MainActivitySimka04");
        aliases.put("simka-05", "io.github.diaryspo.MainActivitySimka05");
        aliases.put("simka-06", "io.github.diaryspo.MainActivitySimka06");
        aliases.put("simka-07", "io.github.diaryspo.MainActivitySimka07");
        aliases.put("simka-08", "io.github.diaryspo.MainActivitySimka08");
        aliases.put("simka-09", "io.github.diaryspo.MainActivitySimka09");
        aliases.put("simka-10", "io.github.diaryspo.MainActivitySimka10");
        aliases.put("simka-11", "io.github.diaryspo.MainActivitySimka11");
        aliases.put("simka-12", "io.github.diaryspo.MainActivitySimka12");
        aliases.put("simka-13", "io.github.diaryspo.MainActivitySimka13");
        aliases.put("simka-14", "io.github.diaryspo.MainActivitySimka14");
        aliases.put("simka-15", "io.github.diaryspo.MainActivitySimka15");
        aliases.put("simka-16", "io.github.diaryspo.MainActivitySimka16");
        aliases.put("simka-17", "io.github.diaryspo.MainActivitySimka17");
        aliases.put("simka-18", "io.github.diaryspo.MainActivitySimka18");
        aliases.put("simka-19", "io.github.diaryspo.MainActivitySimka19");
        aliases.put("simka-20", "io.github.diaryspo.MainActivitySimka20");
        aliases.put("simka-21", "io.github.diaryspo.MainActivitySimka21");
        aliases.put("simka-22", "io.github.diaryspo.MainActivitySimka22");
        aliases.put("simka-23", "io.github.diaryspo.MainActivitySimka23");
        aliases.put("simka-24", "io.github.diaryspo.MainActivitySimka24");
        aliases.put("simka-25", "io.github.diaryspo.MainActivitySimka25");
        aliases.put("simka-26", "io.github.diaryspo.MainActivitySimka26");
        aliases.put("simka-27", "io.github.diaryspo.MainActivitySimka27");
        aliases.put("simka-28", "io.github.diaryspo.MainActivitySimka28");
        aliases.put("simka-29", "io.github.diaryspo.MainActivitySimka29");
        aliases.put("simka-31", "io.github.diaryspo.MainActivitySimka31");
        aliases.put("simka-32", "io.github.diaryspo.MainActivitySimka32");
        aliases.put("simka-33", "io.github.diaryspo.MainActivitySimka33");
        aliases.put("simka-34", "io.github.diaryspo.MainActivitySimka34");
        aliases.put("simka-35", "io.github.diaryspo.MainActivitySimka35");
        aliases.put("simka-37", "io.github.diaryspo.MainActivitySimka37");
        aliases.put("simka-39", "io.github.diaryspo.MainActivitySimka39");
        aliases.put("simka-40", "io.github.diaryspo.MainActivitySimka40");
        aliases.put("simka-41", "io.github.diaryspo.MainActivitySimka41");
        aliases.put("simka-42", "io.github.diaryspo.MainActivitySimka42");
        aliases.put("simka-43", "io.github.diaryspo.MainActivitySimka43");
        aliases.put("simka-44", "io.github.diaryspo.MainActivitySimka44");
        aliases.put("simka-45", "io.github.diaryspo.MainActivitySimka45");
        aliases.put("simka-46", "io.github.diaryspo.MainActivitySimka46");
        aliases.put("simka-47", "io.github.diaryspo.MainActivitySimka47");
        return aliases;
    }

    @PluginMethod
    public void getOptions(PluginCall call) {
        JSArray options = new JSArray();
        options.put(option("default", "Классическая"));
        options.put(option("simka", "Симка"));
        options.put(option("simka-throne", "Трон"));
        options.put(option("simka-01", "Симка 01"));
        options.put(option("simka-02", "Симка 02"));
        options.put(option("simka-03", "Симка 03"));
        options.put(option("simka-04", "Симка 04"));
        options.put(option("simka-05", "Симка 05"));
        options.put(option("simka-06", "Симка 06"));
        options.put(option("simka-07", "Симка 07"));
        options.put(option("simka-08", "Симка 08"));
        options.put(option("simka-09", "Симка 09"));
        options.put(option("simka-10", "Симка 10"));
        options.put(option("simka-11", "Симка 11"));
        options.put(option("simka-12", "Симка 12"));
        options.put(option("simka-13", "Симка 13"));
        options.put(option("simka-14", "Симка 14"));
        options.put(option("simka-15", "Симка 15"));
        options.put(option("simka-16", "Симка 16"));
        options.put(option("simka-17", "Симка 17"));
        options.put(option("simka-18", "Симка 18"));
        options.put(option("simka-19", "Симка 19"));
        options.put(option("simka-20", "Симка 20"));
        options.put(option("simka-21", "Симка 21"));
        options.put(option("simka-22", "Симка 22"));
        options.put(option("simka-23", "Симка 23"));
        options.put(option("simka-24", "Симка 24"));
        options.put(option("simka-25", "Симка 25"));
        options.put(option("simka-26", "Симка 26"));
        options.put(option("simka-27", "Симка 27"));
        options.put(option("simka-28", "Симка 28"));
        options.put(option("simka-29", "Симка 29"));
        options.put(option("simka-31", "Симка 31"));
        options.put(option("simka-32", "Симка 32"));
        options.put(option("simka-33", "Симка 33"));
        options.put(option("simka-34", "Симка 34"));
        options.put(option("simka-35", "Симка 35"));
        options.put(option("simka-37", "Симка 37"));
        options.put(option("simka-39", "Симка 39"));
        options.put(option("simka-40", "Симка 40"));
        options.put(option("simka-41", "Симка 41"));
        options.put(option("simka-42", "Симка 42"));
        options.put(option("simka-43", "Симка 43"));
        options.put(option("simka-44", "Симка 44"));
        options.put(option("simka-45", "Симка 45"));
        options.put(option("simka-46", "Симка 46"));
        options.put(option("simka-47", "Симка 47"));
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
        if (!ALIASES.containsKey(iconId)) {
            iconId = "default";
        }
        JSObject result = new JSObject();
        result.put("iconId", iconId);
        call.resolve(result);
    }

    @PluginMethod
    public void setIcon(PluginCall call) {
        String iconId = call.getString("iconId", "default");
        if (!ALIASES.containsKey(iconId)) {
            // Старые id (cat/playful/alt) больше не поддерживаем.
            iconId = "default";
        }

        PackageManager pm = getContext().getPackageManager();
        for (Map.Entry<String, String> entry : ALIASES.entrySet()) {
            setAliasEnabled(pm, entry.getValue(), entry.getKey().equals(iconId));
        }

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

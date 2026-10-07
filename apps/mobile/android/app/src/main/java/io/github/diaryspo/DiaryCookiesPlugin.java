package io.github.diaryspo;

import android.webkit.CookieManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Куки чужого домена из общего android.webkit.CookieManager. */
@CapacitorPlugin(name = "DiaryCookies")
public class DiaryCookiesPlugin extends Plugin {

    @PluginMethod
    public void getCookies(PluginCall call) {
        String url = call.getString("url");
        if (url == null) {
            call.reject("Must provide url");
            return;
        }
        JSObject result = new JSObject();
        String raw = CookieManager.getInstance().getCookie(url);
        if (raw != null) {
            for (String part : raw.split(";")) {
                int sep = part.indexOf('=');
                if (sep <= 0) continue;
                String key = part.substring(0, sep).trim();
                String value = part.substring(sep + 1).trim();
                if (!key.isEmpty() && !key.startsWith("$")) {
                    result.put(key, value);
                }
            }
        }
        call.resolve(result);
    }

    @PluginMethod
    public void setCookie(PluginCall call) {
        String url = call.getString("url");
        String key = call.getString("key");
        String value = call.getString("value");
        if (url == null || key == null || value == null) {
            call.reject("Must provide url, key and value");
            return;
        }
        CookieManager manager = CookieManager.getInstance();
        manager.setCookie(url, key + "=" + value);
        manager.flush();
        call.resolve();
    }
}

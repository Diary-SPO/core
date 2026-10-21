package io.github.diaryspo;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Логин и пароль только в шифрованном хранилище, никогда в localStorage. */
@CapacitorPlugin(name = "DiaryCredentials")
public class DiaryCredentialsPlugin extends Plugin {

    private SharedPreferences prefs() throws Exception {
        Context context = getContext();
        MasterKey masterKey = new MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build();
        return EncryptedSharedPreferences.create(
                context,
                "diary_credentials",
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM);
    }

    @PluginMethod
    public void saveCredentials(PluginCall call) {
        String login = call.getString("login");
        String password = call.getString("password");
        String diaryUrl = call.getString("diaryUrl");
        if (login == null || password == null || diaryUrl == null) {
            call.reject("Must provide login, password and diaryUrl");
            return;
        }
        try {
            prefs().edit()
                    .putString("login", login)
                    .putString("password", password)
                    .putString("diaryUrl", diaryUrl)
                    .apply();
            call.resolve();
        } catch (Exception e) {
            call.reject("Unable to save credentials");
        }
    }

    @PluginMethod
    public void getCredentials(PluginCall call) {
        try {
            SharedPreferences prefs = prefs();
            String login = prefs.getString("login", null);
            String password = prefs.getString("password", null);
            String diaryUrl = prefs.getString("diaryUrl", null);
            if (login == null || password == null || diaryUrl == null) {
                call.reject("No saved credentials");
                return;
            }
            JSObject result = new JSObject();
            result.put("login", login);
            result.put("password", password);
            result.put("diaryUrl", diaryUrl);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Unable to read credentials");
        }
    }

    @PluginMethod
    public void clearCredentials(PluginCall call) {
        try {
            prefs().edit().clear().apply();
            call.resolve();
        } catch (Exception e) {
            call.reject("Unable to clear credentials");
        }
    }
}

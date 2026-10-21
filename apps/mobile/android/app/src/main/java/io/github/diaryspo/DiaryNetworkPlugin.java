package io.github.diaryspo;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Активен ли VPN-транспорт, без чтения трафика и адресов. */
@CapacitorPlugin(name = "DiaryNetwork")
public class DiaryNetworkPlugin extends Plugin {

    @PluginMethod
    public void isVpnActive(PluginCall call) {
        boolean active = false;
        try {
            ConnectivityManager manager = (ConnectivityManager) getContext()
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (manager != null) {
                for (Network network : manager.getAllNetworks()) {
                    NetworkCapabilities caps = manager.getNetworkCapabilities(network);
                    if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                        active = true;
                        break;
                    }
                }
            }
        } catch (Exception e) {
            call.reject("Unable to check VPN state");
            return;
        }
        JSObject result = new JSObject();
        result.put("active", active);
        call.resolve(result);
    }
}

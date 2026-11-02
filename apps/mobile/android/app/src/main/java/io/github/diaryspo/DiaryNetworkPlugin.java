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

/** Сеть: VPN и тип транспорта (wifi/cellular), без чтения трафика. */
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

    @PluginMethod
    public void getTransport(PluginCall call) {
        String transport = "none";
        try {
            ConnectivityManager manager = (ConnectivityManager) getContext()
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (manager != null) {
                Network active = manager.getActiveNetwork();
                NetworkCapabilities caps =
                        active != null ? manager.getNetworkCapabilities(active) : null;
                if (caps != null) {
                    if (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                        transport = "wifi";
                    } else if (caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                        transport = "cellular";
                    } else if (caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
                            || caps.hasTransport(NetworkCapabilities.TRANSPORT_USB)
                            || caps.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH)) {
                        transport = "other";
                    } else {
                        transport = "other";
                    }
                }
            }
        } catch (Exception e) {
            call.reject("Unable to read network transport");
            return;
        }
        JSObject result = new JSObject();
        result.put("transport", transport);
        call.resolve(result);
    }
}

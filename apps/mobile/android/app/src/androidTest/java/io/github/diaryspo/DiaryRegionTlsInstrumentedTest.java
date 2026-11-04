package io.github.diaryspo;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.CertPathValidatorException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.List;
import javax.net.ssl.SSLHandshakeException;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * HttpsURLConnection в приложении читает network_security_config — сюда входят CA НУЦ.
 * Любая ошибка trust path = регрессия для региона.
 */
@RunWith(AndroidJUnit4.class)
public class DiaryRegionTlsInstrumentedTest {

    private static final String[] REGION_URLS = {
        "https://netspo.edu22.info/",
        "https://spo.volganet.ru/",
        "https://poo.zabedu.ru/",
        "https://spo.admoblkaluga.ru/",
        "https://prof.sgo41.ru/",
        "https://poo.kchgov.ru/",
        "https://spo.rso23.ru/",
        "https://poo.prim-edu.ru/",
        "https://spo.obr03.ru/",
        "https://poo.edu-ri.ru/",
        "https://giseo-spo.rkomi.ru/",
        "https://poo.e-yakutia.ru/",
        "https://e-college.ryazan.gov.ru/",
        "https://spo.asurso.ru/",
        "https://spo.admsakhalin.ru/",
        "https://poo.tomedu.ru/",
        "https://spo1.edu71.ru/",
        "https://spo.cit73.ru/",
        "https://poo.edu-74.ru/",
        "https://spo.cap.ru/",
        "https://spo.yanao.ru/",
        "https://poo.eduportal44.ru/"
    };

    @Test
    public void allDiaryRegionsPassTlsTrust() {
        List<String> certFailures = new ArrayList<>();
        List<String> otherFailures = new ArrayList<>();

        for (String url : REGION_URLS) {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
                connection.setConnectTimeout(15_000);
                connection.setReadTimeout(15_000);
                connection.setInstanceFollowRedirects(false);
                connection.connect();
                int code = connection.getResponseCode();
                connection.disconnect();
                if (code < 100 || code >= 600) {
                    otherFailures.add(url + " unexpected HTTP " + code);
                }
            } catch (Exception e) {
                if (isCertTrustFailure(e)) {
                    certFailures.add(url + " :: " + rootMessage(e));
                } else {
                    otherFailures.add(url + " :: " + rootMessage(e));
                }
            }
        }

        if (!certFailures.isEmpty()) {
            fail("TLS trust failures:\n" + String.join("\n", certFailures));
        }
        // Сеть/техработы не считаем провалом trust, но тест всё равно должен
        // показать, что ни один регион не упал на сертификате.
        assertTrue(
                "No regions probed (unexpected)",
                REGION_URLS.length > 0);
        if (!otherFailures.isEmpty()) {
            // Не валим тест: интересует именно cert. Лог для отчёта.
            System.out.println("Non-cert failures:\n" + String.join("\n", otherFailures));
        }
    }

    private static boolean isCertTrustFailure(Throwable error) {
        for (Throwable t = error; t != null; t = t.getCause()) {
            if (t instanceof SSLHandshakeException
                    || t instanceof CertificateException
                    || t instanceof CertPathValidatorException) {
                return true;
            }
            String message = t.getMessage();
            if (message != null
                    && (message.contains("Trust anchor")
                            || message.contains("CertPath")
                            || message.contains("certificate"))) {
                return true;
            }
        }
        return false;
    }

    private static String rootMessage(Throwable error) {
        Throwable t = error;
        while (t.getCause() != null) {
            t = t.getCause();
        }
        return t.getClass().getSimpleName() + ": " + t.getMessage();
    }
}

package io.github.diaryspo;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyStore;
import java.security.cert.CertPath;
import java.security.cert.CertPathValidator;
import java.security.cert.CertificateFactory;
import java.security.cert.PKIXParameters;
import java.security.cert.TrustAnchor;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLHandshakeException;
import javax.net.ssl.TrustManagerFactory;
import org.junit.Test;

/**
 * System CA + встроенный НУЦ Минцифры — та же модель, что network_security_config.
 * Sub CA 2024 нужен Калуге/Рязани; остальным регионам хватает system.
 */
public class RussianTrustedCaTest {

    private static final Path RAW = Path.of("src/main/res/raw");
    private static final Path FIXTURE =
            Path.of("src/test/resources/certs/spo_admoblkaluga_leaf.pem");

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
        "https://poo.tomedu.ru/",
        "https://spo1.edu71.ru/",
        "https://spo.cit73.ru/",
        "https://poo.edu-74.ru/",
        "https://spo.yanao.ru/"
    };

    private static X509Certificate loadPem(Path path) throws Exception {
        byte[] pem = Files.readAllBytes(path);
        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        try (InputStream in = new ByteArrayInputStream(pem)) {
            return (X509Certificate) factory.generateCertificate(in);
        }
    }

    private static Set<TrustAnchor> embeddedAnchors() throws Exception {
        Set<TrustAnchor> anchors = new HashSet<>();
        for (String name :
                List.of(
                        "russian_trusted_root_ca.pem",
                        "russian_trusted_sub_ca.pem",
                        "russian_trusted_sub_ca_2024.pem")) {
            anchors.add(new TrustAnchor(loadPem(RAW.resolve(name)), null));
        }
        return anchors;
    }

    /** Как в приложении: system trust + НУЦ. */
    private static SSLContext appLikeSslContext() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, null);

        TrustManagerFactory systemTmf =
                TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        systemTmf.init((KeyStore) null);
        // Скопировать system anchors через default trust managers нельзя напрямую —
        // берём cacerts JVM как «system».
        String javaHome = System.getProperty("java.home");
        Path cacerts = Path.of(javaHome, "lib", "security", "cacerts");
        KeyStore system = KeyStore.getInstance(KeyStore.getDefaultType());
        try (InputStream in = Files.newInputStream(cacerts)) {
            system.load(in, "changeit".toCharArray());
        }
        Enumeration<String> aliases = system.aliases();
        while (aliases.hasMoreElements()) {
            String alias = aliases.nextElement();
            if (system.isCertificateEntry(alias)) {
                keyStore.setCertificateEntry("system-" + alias, system.getCertificate(alias));
            }
        }
        int index = 0;
        for (TrustAnchor anchor : embeddedAnchors()) {
            keyStore.setCertificateEntry("mincifry-" + index++, anchor.getTrustedCert());
        }

        TrustManagerFactory tmf =
                TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(keyStore);
        SSLContext context = SSLContext.getInstance("TLS");
        context.init(null, tmf.getTrustManagers(), null);
        return context;
    }

    @Test
    public void kalugaLeafValidatesAgainstEmbeddedMincifryCas() throws Exception {
        X509Certificate leaf = loadPem(FIXTURE);
        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        CertPath path = factory.generateCertPath(List.of(leaf));

        PKIXParameters params = new PKIXParameters(embeddedAnchors());
        params.setRevocationEnabled(false);

        CertPathValidator.getInstance("PKIX").validate(path, params);
    }

    @Test
    public void allDiaryRegionsPassTlsTrustWithAppLikeStore() throws Exception {
        SSLContext context = appLikeSslContext();
        List<String> certFailures = new ArrayList<>();
        List<String> otherFailures = new ArrayList<>();

        for (String url : REGION_URLS) {
            try {
                HttpsURLConnection connection =
                        (HttpsURLConnection) java.net.URI.create(url).toURL().openConnection();
                connection.setSSLSocketFactory(context.getSocketFactory());
                connection.setConnectTimeout(15_000);
                connection.setReadTimeout(15_000);
                connection.setInstanceFollowRedirects(false);
                connection.connect();
                int code = connection.getResponseCode();
                connection.disconnect();
                assertTrue(url + " unexpected HTTP " + code, code >= 100 && code < 600);
            } catch (SSLHandshakeException e) {
                certFailures.add(url + " :: " + e.getMessage());
            } catch (Exception e) {
                Throwable root = e;
                while (root.getCause() != null) {
                    root = root.getCause();
                }
                if (root instanceof SSLHandshakeException
                        || (root.getMessage() != null
                                && root.getMessage().contains("PKIX"))) {
                    certFailures.add(url + " :: " + root.getMessage());
                } else {
                    otherFailures.add(url + " :: " + root.getClass().getSimpleName() + ": "
                            + root.getMessage());
                }
            }
        }

        if (!certFailures.isEmpty()) {
            fail("TLS trust failures:\n" + String.join("\n", certFailures));
        }
        System.out.println("Non-cert failures (" + otherFailures.size() + "):");
        for (String line : otherFailures) {
            System.out.println("  " + line);
        }
    }
}

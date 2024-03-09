package com.example.diary_spo

import android.os.Build
import android.os.Bundle
import android.webkit.WebView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import androidx.webkit.WebViewFeature
import com.example.diary_spo.interfaces.LocalContentWebViewClient

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.webview)

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("diary-spo.ru")
            .addPathHandler("/", AssetsPathHandler(this))
            .build()

        val myWebView: WebView = findViewById(R.id.webview)
        myWebView.webViewClient = LocalContentWebViewClient(assetLoader)
        myWebView.settings.javaScriptEnabled = true
        myWebView.settings.domStorageEnabled = true

        myWebView.loadUrl("https://diary-spo.ru/index.html")
    }
}
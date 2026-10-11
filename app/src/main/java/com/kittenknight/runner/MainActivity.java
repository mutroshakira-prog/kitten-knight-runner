package com.kittenknight.runner;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.net.Uri;
import java.io.ByteArrayInputStream;
import java.io.IOException;

public class MainActivity extends Activity {
    private WebView game;
    private static final String ORIGIN = "appassets.androidplatform.net";
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        game = new WebView(this);
        game.setBackgroundColor(0xff183c2c);
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccess(false);
        game.getSettings().setAllowContentAccess(false);
        game.getSettings().setMediaPlaybackRequiresUserGesture(true);
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request.getUrl());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!isLocal(uri)) return blocked();
                String path = uri.getPath();
                if (path == null || !path.startsWith("/assets/game/") || path.contains("..")) return blocked();
                String name = path.substring("/assets/".length());
                String mime = name.endsWith(".html") ? "text/html" : name.endsWith(".js") ? "application/javascript" : name.endsWith(".css") ? "text/css" : name.endsWith(".png") ? "image/png" : "application/octet-stream";
                try { return new WebResourceResponse(mime, "UTF-8", getAssets().open(name)); }
                catch (IOException e) { return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null, new ByteArrayInputStream(new byte[0])); }
            }
        });
        setContentView(game);
        fullscreen();
        game.loadUrl("https://" + ORIGIN + "/assets/game/index.html");
    }
    private static boolean isLocal(Uri uri) { return "https".equals(uri.getScheme()) && ORIGIN.equals(uri.getHost()); }
    private static WebResourceResponse blocked() { return new WebResourceResponse("text/plain", "UTF-8", 403, "Forbidden", null, new ByteArrayInputStream(new byte[0])); }
    private void fullscreen() {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.systemBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }
    @Override public void onWindowFocusChanged(boolean focus) { super.onWindowFocusChanged(focus); if (focus) fullscreen(); }
    @Override protected void onPause() {
        if (game != null) { game.evaluateJavascript("window.pauseGame && window.pauseGame()", null); game.onPause(); }
        super.onPause();
    }
    @Override protected void onResume() { super.onResume(); if (game != null) game.onResume(); }
    @Override public void onBackPressed() {
        game.evaluateJavascript("window.pauseGame && window.pauseGame()", null);
        new AlertDialog.Builder(this).setTitle("Выйти из игры?").setMessage("Рекорд сохранится. Текущий забег начнётся заново при следующем запуске.")
            .setNegativeButton("Остаться", new DialogInterface.OnClickListener() { public void onClick(DialogInterface dialog, int which) { fullscreen(); } })
            .setPositiveButton("Выйти", new DialogInterface.OnClickListener() { public void onClick(DialogInterface dialog, int which) { finish(); } }).show();
    }
    @Override protected void onDestroy() { if (game != null) { game.stopLoading(); game.destroy(); game = null; } super.onDestroy(); }
}

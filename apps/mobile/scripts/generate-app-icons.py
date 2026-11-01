#!/usr/bin/env python3
"""Генерирует launcher/splash-ресурсы и web-превью из icon-sources.

Adaptive foreground кладётся в safe-zone (66/108), иначе лаунчер
обрезает края и иконка выглядит «приближенной».
Ассеты пишутся в WebP.
"""

from __future__ import annotations

import re
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'mobile' / 'icon-sources'
WEB_ICONS = ROOT / 'web' / 'src' / 'assets' / 'images' / 'app-icons'
ANDROID_RES = ROOT / 'mobile' / 'android' / 'app' / 'src' / 'main' / 'res'
MANIFEST = ROOT / 'mobile' / 'android' / 'app' / 'src' / 'main' / 'AndroidManifest.xml'
PLUGIN = (
    ROOT
    / 'mobile'
    / 'android'
    / 'app'
    / 'src'
    / 'main'
    / 'java'
    / 'io'
    / 'github'
    / 'diaryspo'
    / 'DiaryAppIconPlugin.java'
)

# legacy size, adaptive canvas size
DENSITIES = {
    'mdpi': (48, 108),
    'hdpi': (72, 162),
    'xhdpi': (96, 216),
    'xxhdpi': (144, 324),
    'xxxhdpi': (192, 432),
}

# Доля арта на adaptive-слое (1.0 = во весь слой, сильно обрезает лаунчер).
# 66/108 — строгий safe-zone (была заметная «рамка»), ~0.78 — чуть крупнее.
SAFE_ZONE_RATIO = 0.78
WEBP_QUALITY = 90
PREVIEW_SIZE = 192


def parse_sources() -> list[dict[str, str]]:
    icons: list[dict[str, str]] = []
    for path in sorted(SOURCES.glob('*.png')):
        name = path.name
        if name == 'diary-spo-alt-icon-simka-1024.png':
            icons.append(
                {
                    'id': 'simka',
                    'res': 'simka',
                    'alias': 'MainActivitySimka',
                    'label': 'Симка',
                    'source': str(path),
                }
            )
            continue
        if name == 'diary-spo-alt-icon-simka-throne-1024.png':
            icons.append(
                {
                    'id': 'simka-throne',
                    'res': 'simka_throne',
                    'alias': 'MainActivitySimkaThrone',
                    'label': 'Трон',
                    'source': str(path),
                }
            )
            continue
        match = re.fullmatch(r'simka-icon-(\d+)-1024\.png', name)
        if not match:
            raise SystemExit(f'Unknown source icon name: {name}')
        num = match.group(1)
        icons.append(
            {
                'id': f'simka-{num}',
                'res': f'simka_{num}',
                'alias': f'MainActivitySimka{num}',
                'label': f'Симка {num}',
                'source': str(path),
            }
        )
    return icons


def fit_cover(im: Image.Image, size: int) -> Image.Image:
    src = im.convert('RGBA')
    w, h = src.size
    scale = max(size / w, size / h)
    resized = src.resize(
        (max(1, round(w * scale)), max(1, round(h * scale))),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - size) // 2
    top = (resized.height - size) // 2
    return resized.crop((left, top, left + size, top + size))


def corner_color(im: Image.Image) -> tuple[int, int, int]:
    rgb = im.convert('RGB')
    w, h = rgb.size
    samples = [
        rgb.getpixel((0, 0)),
        rgb.getpixel((w - 1, 0)),
        rgb.getpixel((0, h - 1)),
        rgb.getpixel((w - 1, h - 1)),
        rgb.getpixel((8, 8)),
    ]
    r = sum(p[0] for p in samples) // len(samples)
    g = sum(p[1] for p in samples) // len(samples)
    b = sum(p[2] for p in samples) // len(samples)
    return r, g, b


def circle_mask(size: int) -> Image.Image:
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    return mask


def make_adaptive_foreground(source: Image.Image, canvas_size: int) -> Image.Image:
    """Картинка в safe-zone по центру, края прозрачные — лаунчер не зумит."""
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    art_size = max(1, round(canvas_size * SAFE_ZONE_RATIO))
    art = fit_cover(source, art_size)
    offset = (canvas_size - art_size) // 2
    canvas.paste(art, (offset, offset), art)
    return canvas


def save_webp(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # RGB без альфы чуть легче; RGBA нужен для round/foreground.
    to_save = im
    if im.mode == 'RGBA':
        alpha = im.getchannel('A')
        if alpha.getextrema() == (255, 255):
            to_save = im.convert('RGB')
    elif im.mode != 'RGB':
        to_save = im.convert('RGB')
    to_save.save(path, format='WEBP', quality=WEBP_QUALITY, method=6)


def clear_previous_alt_resources() -> None:
    patterns = (
        'ic_launcher_cat*',
        'ic_launcher_playful*',
        'ic_launcher_simka*',
    )
    for folder in list(ANDROID_RES.glob('mipmap-*')) + list(
        ANDROID_RES.glob('drawable-*')
    ):
        for pattern in patterns:
            for path in folder.glob(pattern):
                path.unlink()
    for path in (ANDROID_RES / 'drawable').glob('ic_launcher_*_background.xml'):
        if path.name == 'ic_launcher_background.xml':
            continue
        if 'cat' in path.name or 'playful' in path.name or 'simka' in path.name:
            path.unlink(missing_ok=True)
    for path in (ANDROID_RES / 'mipmap-anydpi-v26').glob('ic_launcher_simka*'):
        path.unlink()


def write_adaptive_xml(res_name: str) -> None:
    content = textwrap.dedent(
        f"""\
        <?xml version="1.0" encoding="utf-8"?>
        <adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
            <background android:drawable="@drawable/ic_launcher_{res_name}_background"/>
            <foreground android:drawable="@mipmap/ic_launcher_{res_name}_foreground"/>
        </adaptive-icon>
        """
    )
    anydpi = ANDROID_RES / 'mipmap-anydpi-v26'
    anydpi.mkdir(parents=True, exist_ok=True)
    (anydpi / f'ic_launcher_{res_name}.xml').write_text(content, encoding='utf-8')
    (anydpi / f'ic_launcher_{res_name}_round.xml').write_text(content, encoding='utf-8')


def write_background_xml(res_name: str, color: tuple[int, int, int]) -> None:
    hex_color = '#{:02X}{:02X}{:02X}'.format(*color)
    content = textwrap.dedent(
        f"""\
        <?xml version="1.0" encoding="utf-8"?>
        <shape xmlns:android="http://schemas.android.com/apk/res/android"
            android:shape="rectangle">
            <solid android:color="{hex_color}" />
        </shape>
        """
    )
    path = ANDROID_RES / 'drawable' / f'ic_launcher_{res_name}_background.xml'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def generate_icon_assets(icon: dict[str, str]) -> None:
    source = Image.open(icon['source'])
    color = corner_color(source)
    res = icon['res']
    write_background_xml(res, color)
    write_adaptive_xml(res)

    for density, (legacy, foreground) in DENSITIES.items():
        legacy_im = fit_cover(source, legacy).convert('RGB')
        fg_im = make_adaptive_foreground(source, foreground)
        round_im = fit_cover(source, legacy).convert('RGBA')
        round_im.putalpha(circle_mask(legacy))

        folder = ANDROID_RES / f'mipmap-{density}'
        save_webp(legacy_im, folder / f'ic_launcher_{res}.webp')
        save_webp(round_im, folder / f'ic_launcher_{res}_round.webp')
        save_webp(fg_im, folder / f'ic_launcher_{res}_foreground.webp')

    preview = fit_cover(source, PREVIEW_SIZE).convert('RGB')
    save_webp(preview, WEB_ICONS / f'{icon["id"]}.webp')


def clear_per_icon_splash_assets() -> None:
    """Один общий splash; отдельные splash_icon_* под иконки не нужны."""
    styles = ANDROID_RES / 'values' / 'app_icon_splash_styles.xml'
    styles.unlink(missing_ok=True)
    for folder in ANDROID_RES.glob('drawable*'):
        for path in folder.glob('splash_icon_simka*'):
            path.unlink(missing_ok=True)


def _alias_xml(
    *,
    name: str,
    enabled: bool,
    icon: str,
    round_icon: str,
) -> str:
    enabled_value = 'true' if enabled else 'false'
    return textwrap.indent(
        textwrap.dedent(
            f"""\
            <activity-alias
                android:name=".{name}"
                android:enabled="{enabled_value}"
                android:exported="true"
                android:icon="@mipmap/{icon}"
                android:roundIcon="@mipmap/{round_icon}"
                android:label="@string/app_name"
                android:targetActivity=".MainActivity">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity-alias>
            """
        ).rstrip()
        + '\n',
        '        ',
    )


def render_manifest(icons: list[dict[str, str]]) -> None:
    aliases = [
        _alias_xml(
            name='MainActivityDefault',
            enabled=True,
            icon='ic_launcher',
            round_icon='ic_launcher_round',
        )
    ]
    for icon in icons:
        aliases.append(
            _alias_xml(
                name=icon['alias'],
                enabled=False,
                icon=f"ic_launcher_{icon['res']}",
                round_icon=f"ic_launcher_{icon['res']}_round",
            )
        )

    text = MANIFEST.read_text(encoding='utf-8')
    start = text.index('<activity-alias')
    start = text.rfind('\n', 0, start) + 1
    end = text.index('<provider')
    end = text.rfind('\n', 0, end) + 1
    new_text = text[:start] + '\n'.join(aliases) + '\n' + text[end:]
    MANIFEST.write_text(new_text, encoding='utf-8')


def render_plugin(icons: list[dict[str, str]]) -> None:
    put_lines = [
        '        aliases.put("default", "io.github.diaryspo.MainActivityDefault");'
    ]
    put_lines.extend(
        f'        aliases.put("{icon["id"]}", "io.github.diaryspo.{icon["alias"]}");'
        for icon in icons
    )
    option_lines = [
        '        options.put(option("default", "Классическая"));'
    ]
    option_lines.extend(
        f'        options.put(option("{icon["id"]}", "{icon["label"]}"));'
        for icon in icons
    )

    content = f"""package io.github.diaryspo;

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
public class DiaryAppIconPlugin extends Plugin {{
    private static final String PREFS = "diary_app_icon";
    private static final String PREF_ICON = "iconId";
    private static final Map<String, String> ALIASES = createAliases();

    private static Map<String, String> createAliases() {{
        Map<String, String> aliases = new LinkedHashMap<>();
{chr(10).join(put_lines)}
        return aliases;
    }}

    @PluginMethod
    public void getOptions(PluginCall call) {{
        JSArray options = new JSArray();
{chr(10).join(option_lines)}
        JSObject result = new JSObject();
        result.put("options", options);
        result.put("supported", true);
        call.resolve(result);
    }}

    @PluginMethod
    public void getCurrent(PluginCall call) {{
        String iconId = getContext()
                .getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)
                .getString(PREF_ICON, "default");
        if (!ALIASES.containsKey(iconId)) {{
            iconId = "default";
        }}
        JSObject result = new JSObject();
        result.put("iconId", iconId);
        call.resolve(result);
    }}

    @PluginMethod
    public void setIcon(PluginCall call) {{
        String iconId = call.getString("iconId", "default");
        if (!ALIASES.containsKey(iconId)) {{
            // Старые id (cat/playful/alt) больше не поддерживаем.
            iconId = "default";
        }}

        PackageManager pm = getContext().getPackageManager();
        for (Map.Entry<String, String> entry : ALIASES.entrySet()) {{
            setAliasEnabled(pm, entry.getValue(), entry.getKey().equals(iconId));
        }}

        getContext()
                .getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)
                .edit()
                .putString(PREF_ICON, iconId)
                .apply();

        JSObject result = new JSObject();
        result.put("iconId", iconId);
        call.resolve(result);
    }}

    private void setAliasEnabled(PackageManager pm, String alias, boolean enabled) {{
        ComponentName component = new ComponentName(getContext(), alias);
        pm.setComponentEnabledSetting(
                component,
                enabled
                        ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                        : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);
    }}

    private JSObject option(String id, String name) {{
        JSObject item = new JSObject();
        item.put("id", id);
        item.put("name", name);
        return item;
    }}
}}
"""
    PLUGIN.write_text(content, encoding='utf-8')


def cleanup_web_previews(icons: list[dict[str, str]]) -> None:
    keep = {'default.webp', 'default.png'} | {
        f'{icon["id"]}.webp' for icon in icons
    }
    for path in WEB_ICONS.glob('*'):
        if path.suffix.lower() in {'.png', '.webp'} and path.name not in keep:
            # Удаляем старые png-превью симки.
            if path.suffix.lower() == '.png' and path.stem != 'default':
                path.unlink()
            elif path.suffix.lower() == '.webp' and path.name not in keep:
                path.unlink()


def ensure_default_webp() -> None:
    png = WEB_ICONS / 'default.png'
    webp = WEB_ICONS / 'default.webp'
    if png.exists():
        save_webp(Image.open(png).convert('RGBA'), webp)
        png.unlink()


def render_web_preview_catalog(icons: list[dict[str, str]]) -> None:
    catalog = (
        ROOT
        / 'web'
        / 'src'
        / 'pages'
        / 'Settings'
        / 'Appearance'
        / 'AppIconGrid'
        / 'previews.ts'
    )
    imports = [
        "import defaultPreview from '../../../../assets/images/app-icons/default.webp'"
    ]
    entries = ['  default: defaultPreview']
    for icon in icons:
        var_name = icon['id'].replace('-', '_') + 'Preview'
        imports.append(
            f"import {var_name} from '../../../../assets/images/app-icons/{icon['id']}.webp'"
        )
        entries.append(f"  '{icon['id']}': {var_name}")

    content = (
        '\n'.join(imports)
        + '\n\nexport const appIconPreviews: Record<string, string> = {\n'
        + ',\n'.join(entries)
        + '\n}\n'
    )
    catalog.write_text(content, encoding='utf-8')


def main() -> None:
    icons = parse_sources()
    if not icons:
        raise SystemExit('No icon sources found')

    clear_previous_alt_resources()
    ensure_default_webp()
    for icon in icons:
        print(f'generate {icon["id"]}')
        generate_icon_assets(icon)

    cleanup_web_previews(icons)
    render_web_preview_catalog(icons)
    clear_per_icon_splash_assets()
    render_manifest(icons)
    render_plugin(icons)
    print(f'done: {len(icons)} icons (webp, safe-zone)')


if __name__ == '__main__':
    main()

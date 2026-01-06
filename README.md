# Flutter Previewer

![Extension Icon](icon.png)

Flutter Previewer is a VS Code extension that lets you quickly generate Flutter
`@Preview()` functions directly from any widget constructor using **Ctrl + .**
(Code Actions).

No right-click. No command palette. Just place your cursor and preview 🚀

---

## ✨ Features

- Generate Flutter `@Preview()` functions automatically
- Works directly from **Ctrl + . (Quick Fix / Refactor)**
- Detects widget constructor under the cursor
- Supports multiline widget constructors
- Automatically adds `widget_previews` import if missing
- Formats the file after generation

---

## 🚀 How to Use

1. Open a Dart file
2. Place your cursor on a widget constructor:

```dart
MyAwesomeWidget(
  title: 'Hello',
  count: 3,
)
```

3. Press **Ctrl + .**
4. Select **“Make Previewer”**
5. Done 🎉

A preview function will be generated at the end of the file.

---

## 🧩 Generated Output Example

```dart
@Preview()
Widget myAwesomeWidgetPreview() {
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Scaffold(
      body: Center(
        child: MyAwesomeWidget(
          title: 'Hello',
          count: 3,
        ),
      ),
    ),
  );
}
```

---

## 📦 Requirements

- Flutter project
- Dart language support
- `widget_previews` package available in your project

```yaml
dependencies:
  widget_previews: ^latest
```

---

## ⚙️ Extension Details

- **Activation**: Dart files only
- **Command ID**: `flutterPreviewer.makePreview`
- **Trigger**: Code Action (`Ctrl + .`)

---

## 🛠️ Known Limitations

- The cursor must be placed on a widget constructor name
- Does not yet detect StatelessWidget / StatefulWidget classes
- Always wraps the widget with `MaterialApp`

---

## 🗺️ Roadmap

- Smart detection of `MaterialApp` / `CupertinoApp`
- Support StatelessWidget / StatefulWidget previews
- Optional preview insertion location
- Custom preview templates

---

## 📄 License

MIT


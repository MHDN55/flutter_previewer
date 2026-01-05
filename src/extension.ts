import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      "dart",
      new PreviewerCodeActionProvider(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "flutterPreviewer.makePreview",
      async (document: vscode.TextDocument, widgetText: string) => {
        const previewCode = buildPreview(widgetText);
        const edit = new vscode.WorkspaceEdit();

        const allText = document.getText();

        // Add preview import if missing
        if (!allText.includes("package:flutter/widget_previews.dart")) {
          edit.insert(
            document.uri,
            new vscode.Position(0, 0),
            "import 'package:flutter/widget_previews.dart';\n"
          );
        }

        // Insert preview at the end of the file
        const end = document.lineAt(document.lineCount - 1).range.end;
        edit.insert(document.uri, end, `\n\n${previewCode}`);

        await vscode.workspace.applyEdit(edit);

        // Format the file
        await vscode.commands.executeCommand(
          "editor.action.formatDocument"
        );
      }
    )
  );
}

class PreviewerCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const widgetCall = extractWidgetCall(document, range.start);
    if (!widgetCall) return;

    const action = new vscode.CodeAction(
      "Make previewer",
      vscode.CodeActionKind.Refactor
    );

    action.command = {
      command: "flutterPreviewer.makePreview",
      title: "Make previewer",
      arguments: [document, widgetCall],
    };

    return [action];
  }
}

/**
 * Extracts the full widget constructor call under the cursor,
 * including multiline arguments.
 */
function extractWidgetCall(
  document: vscode.TextDocument,
  position: vscode.Position
): string | null {
  const text = document.getText();

  const wordRange = document.getWordRangeAtPosition(
    position,
    /[A-Z][A-Za-z0-9_]*/
  );
  if (!wordRange) return null;

  const startOffset = document.offsetAt(wordRange.start);
  let i = document.offsetAt(wordRange.end);

  // Must be followed by '('
  if (text[i] !== "(") return null;

  let parenCount = 0;

  while (i < text.length) {
    if (text[i] === "(") parenCount++;
    if (text[i] === ")") {
      parenCount--;
      if (parenCount === 0) {
        return text.substring(startOffset, i + 1);
      }
    }
    i++;
  }

  return null;
}

function buildPreview(widgetText: string): string {
  const match = widgetText.match(/[A-Z][A-Za-z0-9_]*/);
  const widgetName = match ? match[0] : "widget";

  const functionName =
    widgetName.charAt(0).toLowerCase() +
    widgetName.slice(1) +
    "Preview";

  return `
@Preview()
Widget ${functionName}() {
  return MaterialApp(
    debugShowCheckedModeBanner: false,
    home: Scaffold(
      body: Center(
        child: ${widgetText}
      ),
    ),
  );
}
`.trim();
}

export function deactivate() {}

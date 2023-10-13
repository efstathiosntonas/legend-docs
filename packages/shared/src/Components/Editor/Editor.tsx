import { useObservable, observer } from "@legendapp/state/react";
import classNames from "classnames";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";
import { BiPencil } from "react-icons/bi";

interface Props {
  code: string;
  simpleCode?: string;
  scope?: Record<string, unknown>;
  name?: string;
  noInline?: boolean;
  renderCode?: string;
  previewWidth?: number;
}
const theme = {plain: {}, styles: []}

export const Editor = observer(function Editor({
  code,
  simpleCode,
  scope,
  name,
  previewWidth,
  renderCode,
  noInline = false,
}: Props) {
  code = code.trim();
  simpleCode = simpleCode?.trim();
  const isEditing$ = useObservable(!simpleCode);
  const isEditing = isEditing$.get();
  return (
    <LiveProvider
      code={isEditing ? code : simpleCode}
      transformCode={(output) =>
        (isEditing ? output : code) + (renderCode || "")
      }
      scope={scope}
      enableTypeScript={true}
      theme={theme}
      noInline={noInline}
      disabled={!isEditing}
      language="javascript"
    >
      <div className="flex gap-4 text-sm mt-6">
        <div className="relative flex-1">
          <div
            style={{
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;",
            }}
          >
            <LiveEditor />
          </div>
          {simpleCode && (
            <div
              className="absolute top-3 right-3 !mt-0 flex items-center bg-blue-700 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-600"
              onClick={isEditing$.toggle}
            >
              <BiPencil className="mr-2" />
              {isEditing ? "Editing" : "Edit"}
            </div>
          )}
        </div>
        <div
          className={classNames(name ? `p_${name}` : "col-span-1 rounded")}
          style={{ width: previewWidth }}
        >
          <LivePreview />
        </div>
      </div>
      <LiveError />
    </LiveProvider>
  );
});

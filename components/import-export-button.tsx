"use client";
import { useCategory } from "@/components/category-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prepareDataForExport } from "@/lib/services/export-service";
import {
  exportToClipboard,
  exportToJSONFile,
  importFromJSON,
  importFromText,
} from "@/lib/services/notAsyncLogic";
import {
  ClipboardCopy,
  ClipboardPaste,
  Database,
  FileInput,
  FileOutput,
  FolderInput,
  FolderOutput,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function ImportExportButton({
  expanded = false,
}: {
  expanded?: boolean;
}) {
  const session = useSession();
  const categoryState = useCategory();
  const [purge, setPurge] = useState(true);

  return session.status === "authenticated" ? (
    expanded ? (
      <ExpandedImportExportButton
        categoryState={categoryState}
        purge={purge}
        setPurge={setPurge}
      />
    ) : (
      <CompactImportExportButton
        categoryState={categoryState}
        purge={purge}
        setPurge={setPurge}
      />
    )
  ) : null;
}

function CompactImportExportButton({
  categoryState,
  purge,
  setPurge,
}: {
  categoryState: ReturnType<typeof useCategory>;
  purge: boolean;
  setPurge: (value: boolean) => void;
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Database className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-inherit" />
            <span className="sr-only">Manage data</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage data</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={purge} onCheckedChange={setPurge}>
            Replace existing data
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="size-4 mr-2" /> Import data
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() =>
                    importFromText(purge, categoryState.category?.id)
                  }
                >
                  <ClipboardPaste className="size-4 mr-2" />
                  Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    importFromJSON(purge, categoryState.category?.id!)
                  }
                >
                  <FileOutput className="size-4 mr-2" />
                  JSON-File
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOutput className="size-4 mr-2" />
              Export data
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={async () =>
                    exportToClipboard(
                      await prepareDataForExport(
                        categoryState.category?.name ?? "",
                        categoryState.category?.id
                      )
                    )
                  }
                >
                  <ClipboardCopy className="size-4 mr-2" />
                  Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    exportToJSONFile(
                      await prepareDataForExport(
                        categoryState.category?.name ?? "",
                        categoryState.category?.id
                      ),
                      categoryState.category?.name
                    )
                  }
                >
                  <FileInput className="size-4 mr-2" />
                  JSON-File
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function ExpandedImportExportButton({
  categoryState,
  purge,
  setPurge,
}: {
  categoryState: ReturnType<typeof useCategory>;
  purge: boolean;
  setPurge: (value: boolean) => void;
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 flex-shrink-0 w-full flex flex-row gap-2"
          >
            <Database className="size-4 text-inherit" />
            Manage data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage data</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={purge} onCheckedChange={setPurge}>
            Replace existing data
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="size-4 mr-2" /> Import data
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() =>
                    importFromText(purge, categoryState.category?.id)
                  }
                >
                  <ClipboardPaste className="size-4 mr-2" />
                  Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    importFromJSON(purge, categoryState.category?.id!)
                  }
                >
                  <FileOutput className="size-4 mr-2" />
                  JSON-File
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOutput className="size-4 mr-2" />
              Export data
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={async () =>
                    exportToClipboard(
                      await prepareDataForExport(
                        categoryState.category?.name ?? "",
                        categoryState.category?.id
                      )
                    )
                  }
                >
                  <ClipboardCopy className="size-4 mr-2" />
                  Clipboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () =>
                    exportToJSONFile(
                      await prepareDataForExport(
                        categoryState.category?.name ?? "",
                        categoryState.category?.id
                      ),
                      categoryState.category?.name
                    )
                  }
                >
                  <FileInput className="size-4 mr-2" />
                  JSON-File
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

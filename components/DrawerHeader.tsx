import { memo } from "react";
import { Button } from "@heroui/button";
import { CloseIcon } from "./icons";

interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
  showResetAll?: boolean;
  onResetAll?: () => void;
  children?: React.ReactNode;
}

export const CustomDrawerHeader = memo(function CustomDrawerHeader({
  title,
  onClose,
  showResetAll = false,
  onResetAll,
  children
}: DrawerHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {showResetAll && onResetAll && (
            <Button
              size="sm"
              variant="flat"
              color="warning"
              onPress={onResetAll}
              className="text-xs"
            >
              Reset All
            </Button>
          )}
          <Button
            isIconOnly
            className="text-foreground-500"
            radius="full"
            variant="light"
            onPress={onClose}
          >
            <CloseIcon />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
});

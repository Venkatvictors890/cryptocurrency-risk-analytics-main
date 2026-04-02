import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ExitConfirmationDialogProps {
  /** Controls whether the dialog is visible */
  isOpen: boolean;
  /** True if the user has unsaved changes that need to be addressed */
  hasUnsavedChanges: boolean;
  /** Callback when the dialog should be opened or closed */
  onOpenChange: (open: boolean) => void;
  /** Callback when the user confirms the final close action */
  onConfirmClose: () => void;
  /** 
   * Callback when the user chooses to save. 
   * It should return a Promise that resolves to true if the save was successful. 
   */
  onSave: () => Promise<boolean> | boolean; 
}

export function ExitConfirmationDialog({
  isOpen,
  hasUnsavedChanges,
  onOpenChange,
  onConfirmClose,
  onSave,
}: ExitConfirmationDialogProps) {
  // Step manages which dialog we are currently showing
  const [step, setStep] = useState<"unsaved" | "confirm_exit">("confirm_exit");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize the correct step whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(hasUnsavedChanges ? "unsaved" : "confirm_exit");
    }
  }, [isOpen, hasUnsavedChanges]);

  // Hook into the native browser tab close event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Returning a string forces the browser to show its native "Leave Site?" prompt
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle saving data before moving to the close confirmation
  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    try {
      const success = await onSave();
      if (success !== false) {
        // If save succeeds, gracefully move to the normal close confirmation prompt
        setStep("confirm_exit");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes and move straight to the final confirmation
  const handleDiscardAndContinue = () => {
    setStep("confirm_exit");
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {step === "unsaved" ? (
          <>
            <DialogHeader>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription>
                You have unsaved files. Would you like to save your changes before proceeding to close?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end mt-4">
              {/* 3 Common Buttons: Cancel, Don't Save, Save */}
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDiscardAndContinue} disabled={isSaving}>
                Don't Save
              </Button>
              <Button onClick={handleSaveAndContinue} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save & Continue"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Exit</DialogTitle>
              <DialogDescription>
                Are you sure you want to close this view? Any process running will be terminated.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end mt-4">
              {/* 3 Common Buttons: Cancel, No (Keep Open), Yes (Close) */}
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                No, Keep Open
              </Button>
              <Button variant="default" onClick={onConfirmClose}>
                Yes, Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

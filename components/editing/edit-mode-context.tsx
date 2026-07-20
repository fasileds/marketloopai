"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type EditModeContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};

const EditModeContext = createContext<EditModeContextValue>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
});

/**
 * Edit mode defaults on for admins the moment they land on any page, mirroring
 * a WordPress-style front-end editor. Lives in the root layout so state
 * survives client-side navigation between pages.
 */
export function EditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [editMode, setEditMode] = useState(true);

  return (
    <EditModeContext.Provider value={{ isAdmin, editMode: isAdmin && editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}

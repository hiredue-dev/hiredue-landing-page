"use client";

import { createContext, useContext } from "react";

/**
 * Lets any card or dialog on the job board open the in-page sign-up and
 * download flows: { openAccount({ mode, reason, job, onSuccess }), openDownload() }.
 * Provided by JobBoard; null outside it.
 */
export const JobDialogsContext = createContext(null);

export function useJobDialogs() {
  return useContext(JobDialogsContext);
}

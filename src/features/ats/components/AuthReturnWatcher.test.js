import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";

let search = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
  useRouter: () => ({ push: vi.fn() }),
}));

import { AuthReturnWatcher } from "./AtsChecker.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("AuthReturnWatcher", () => {
  it("fires when the URL gains ?ats=resume, including on a client-side push", async () => {
    const onReturn = vi.fn();
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(createElement(AuthReturnWatcher, { onReturn })));
    expect(onReturn).not.toHaveBeenCalled();

    search = "ats=resume";
    await act(async () => root.render(createElement(AuthReturnWatcher, { onReturn })));
    expect(onReturn).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
  });
});

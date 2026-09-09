import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PasswordInput } from "@/components/password-input";
import { MemoryComposer } from "@/features/archive/components/memory-composer";
import { ArchiveTabs } from "@/components/archive-tabs";
import { DesignSelect } from "@/components/design/design-select";
vi.mock("@posthog/react", () => ({ usePostHog: () => null }));
const child = { id: "child-1", slug: "emma", displayName: "Emma", birthDate: "2021-05-14" };
describe("Apricot archive controls", () => {
  it("toggles password visibility without submitting the form", async () => {
    const submit = vi.fn();
    const user = userEvent.setup();
    render(
      <form onSubmit={submit}>
        <label>
          Password
          <PasswordInput defaultValue="safe-password" />
        </label>
      </form>,
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
    expect(submit).not.toHaveBeenCalled();
  });
  it("maps inclusive navigation labels to existing route views", async () => {
    const navigate = vi.fn();
    render(<ArchiveTabs active="parent" onNavigate={navigate} />);
    expect(screen.queryByRole("tab", { name: "Parent" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Timeline" }));
    expect(navigate).toHaveBeenCalledWith("timeline");
  });
  it("keeps the media upload before title and disables it for stories", async () => {
    render(
      <MemoryComposer
        child={child}
        initialKind="photo"
        onClose={vi.fn()}
        onCreated={vi.fn()}
        role="parent"
      />,
    );
    const file = document.querySelector("input[type=file]")!;
    const title = screen.getByRole("textbox", { name: "Memory title" });
    expect(file.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Story" }));
    expect(file).toBeDisabled();
    expect(title).toHaveClass("writing-title");
  });
  it("preserves tenant-scoped API payloads when saving a written memory", async () => {
    window.history.replaceState({}, "", "/test-family");
    const request = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ memory: { id: "m1" } }), { status: 200 }));
    const created = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryComposer
        child={child}
        initialKind="story"
        onClose={vi.fn()}
        onCreated={created}
        role="contributor"
      />,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Memory title" }), {
      target: { value: "First words" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Memory description" }), {
      target: { value: "A happy afternoon." },
    });
    fireEvent.submit(document.querySelector(".editor-form")!);
    await vi.waitFor(() => expect(created).toHaveBeenCalled());
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("/api/families/test-family/archive/memories");
    expect(JSON.parse(options?.body as string)).toMatchObject({
      childId: "child-1",
      title: "First words",
      kind: "story",
      audience: "family",
    });
  });
  it("retains values and disabled choices in the shared select", async () => {
    const change = vi.fn();
    render(
      <DesignSelect aria-label="Role" value="viewer" onChange={change}>
        <option value="viewer">Viewer</option>
        <option value="parent">Parent</option>
      </DesignSelect>,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Role" }));
    await userEvent.click(screen.getByRole("option", { name: "Parent" }));
    expect(change.mock.calls[0][0].target.value).toBe("parent");
  });
});

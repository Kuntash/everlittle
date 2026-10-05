import { fireEvent, render, renderHook, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useQueryState } from "@/features/tools/tool-state";
import { FamilyAgeTool } from "@/features/tools/family-age-tool";
import { GraduationTool } from "@/features/tools/graduation-tool";
import { InterviewTool } from "@/features/tools/interview-tool";

afterEach(() => window.history.replaceState({}, "", "/"));

describe("free tools", () => {
  it("round-trips shared inputs in fragments and strips query parameters", () => {
    window.history.replaceState({}, "", "/tools/test?utm_source=example#name=Maya&born=2020-10-05");
    const { result } = renderHook(() => useQueryState(["name", "born"]));
    expect(result.current.values.born).toBe("2020-10-05");
    act(() => result.current.set("name", "Maya & Sam"));
    const shared = new URL(result.current.shareUrl());
    expect(shared.search).toBe("");
    expect(new URLSearchParams(shared.hash.slice(1)).get("name")).toBe("Maya & Sam");
    expect(window.location.hash).toBe("#name=Maya&born=2020-10-05");
  });

  it("uses the school cutoff and recovers from an unsupported shared cutoff", () => {
    window.history.replaceState({}, "", "/tools/test#born=2026-09-02&cutoff=bad");
    render(<GraduationTool />);
    expect(screen.getByText("Class of 2045", { exact: false })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Kindergarten cutoff date"), {
      target: { value: "9-30" },
    });
    expect(screen.getByText("Class of 2044", { exact: false })).toBeInTheDocument();
  });

  it("rejects adult birthdays after the child instead of displaying invented ages", () => {
    window.history.replaceState({}, "", "/tools/test#born=2020-01-01&a1=2021-01-01");
    render(<FamilyAgeTool />);
    expect(
      screen.getByText("An adult’s birthday must be on or before the child’s birthday."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("keeps annual core questions when interview extras change", () => {
    render(<InterviewTool />);
    const before = screen.getAllByRole("listitem").map((item) => item.textContent);
    fireEvent.click(screen.getByRole("button", { name: "New extras" }));
    const after = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(after).toHaveLength(15);
    expect(after.slice(0, 10)).toEqual(before.slice(0, 10));
    expect(after.slice(10)).not.toEqual(before.slice(10));
  });
});

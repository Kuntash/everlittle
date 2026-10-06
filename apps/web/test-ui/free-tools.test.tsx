import { fireEvent, render, renderHook, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useQueryState } from "@/features/tools/tool-state";
import { CapsuleChecklistTool } from "@/features/tools/capsule-checklist-tool";
import { FutureLetterTool } from "@/features/tools/future-letter-tool";
import { FamilyAgeTool } from "@/features/tools/family-age-tool";
import { GraduationTool } from "@/features/tools/graduation-tool";
import { InterviewTool } from "@/features/tools/interview-tool";

afterEach(() => {
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
});

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

  it("keeps a letter locked until it has words and a future opening date", () => {
    render(<FutureLetterTool />);
    const print = screen.getByRole("button", { name: "Print the letter" });
    expect(print).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Your letter"), {
      target: { value: "You laughed at a sneeze today." },
    });
    expect(print).toBeDisabled();
    expect(screen.getByText("Choose an opening date to print or download it.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Or choose the exact date"), {
      target: { value: "2001-01-01" },
    });
    expect(screen.getByText("Choose an opening date after today.")).toBeInTheDocument();
    expect(print).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "In 10 years" }));
    expect(print).toBeEnabled();
    expect(screen.getByText("That is 10 years from today.", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Dear future me,")).toBeInTheDocument();
  });

  it("offers the eighteenth birthday for a child and keeps the draft in this browser", () => {
    const { unmount } = render(<FutureLetterTool />);
    fireEvent.click(screen.getByRole("button", { name: "My child" }));
    fireEvent.change(screen.getByLabelText("Their first name (optional)"), {
      target: { value: "Maya" },
    });
    expect(screen.queryByRole("button", { name: "On their 18th birthday" })).toBeNull();
    const born = new Date().getFullYear() - 1;
    fireEvent.change(screen.getByLabelText("Their birthday (optional)"), {
      target: { value: `${born}-03-10` },
    });
    fireEvent.click(screen.getByRole("button", { name: "On their 18th birthday" }));
    expect(screen.getByLabelText("Or choose the exact date")).toHaveValue(`${born + 18}-03-10`);
    fireEvent.change(screen.getByLabelText("Your letter"), { target: { value: "Hello you." } });
    expect(screen.getByText("Dear Maya,")).toBeInTheDocument();
    expect(window.location.hash).toBe("");
    unmount();
    render(<FutureLetterTool />);
    expect(screen.getByLabelText("Your letter")).toHaveValue("Hello you.");
    expect(screen.getByLabelText("Their first name (optional)")).toHaveValue("Maya");
  });

  it("ticks capsule items, adds a family's own and loads a shared list", () => {
    window.history.replaceState({}, "", "/tools/test#name=Ava&born=2025-10-06&done=d1,w1");
    render(<CapsuleChecklistTool />);
    expect(screen.getByText("Ava’s first birthday time capsule")).toBeInTheDocument();
    expect(screen.getByText("Do not open until Tue, Oct 6, 2043", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2 of 26")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("A few postage stamps"));
    expect(screen.getByText("3 of 26")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "21" }));
    expect(screen.getByText("Do not open until Sat, Oct 6, 2046", { exact: false })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Add something of your own"), {
      target: { value: "Hospital bracelet" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add to the list" }));
    expect(screen.getByText("3 of 27")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Hospital bracelet"));
    expect(screen.getByText("4 of 27")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove Hospital bracelet" }));
    expect(screen.getByText("3 of 26")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

const mockPush = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();
const mockSetAccount = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@satellite-control/feature-account-auth", () => ({
  useAuthStore: () => ({
    isLoading: false,
    error: null,
    setLoading: mockSetLoading,
    setError: mockSetError,
    setAccount: mockSetAccount,
  }),
}));

vi.mock("@/lib/adapters", () => ({
  authAdapter: { login: vi.fn() },
}));

import { authAdapter } from "@/lib/adapters";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders username, password fields and submit button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("username")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows error when submitting with empty fields", async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole("button"));
    expect(mockSetError).toHaveBeenCalledWith("errorRequired");
  });

  it("calls authAdapter.login with entered credentials", async () => {
    vi.mocked(authAdapter.login).mockResolvedValue({} as any);
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("username"), "admin");
    await userEvent.type(screen.getByLabelText("password"), "password123");
    await userEvent.click(screen.getByRole("button"));

    expect(authAdapter.login).toHaveBeenCalledWith("admin", "password123");
  });

  it("redirects to /dashboard on successful login", async () => {
    vi.mocked(authAdapter.login).mockResolvedValue({} as any);
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("username"), "admin");
    await userEvent.type(screen.getByLabelText("password"), "password123");
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("sets error message when login fails", async () => {
    vi.mocked(authAdapter.login).mockRejectedValue(
      new Error("Invalid credentials"),
    );
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("username"), "admin");
    await userEvent.type(screen.getByLabelText("password"), "wrongpassword");
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});

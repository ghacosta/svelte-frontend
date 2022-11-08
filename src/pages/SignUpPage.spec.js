import SignUpPage from "./SignUpPage.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has Sign Up header", () => {
      render(SignUpPage);
      const header = screen.getByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(SignUpPage);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(SignUpPage);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", async (req, res, ctx) => {
        requestBody = await req.json();
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeAll(() => server.listen());

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    afterAll(() => server.close());

    let button;
    const setup = async () => {
      render(SignUpPage);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      button = screen.getByRole("button", { name: "Sign Up" });
      await userEvent.type(usernameInput, "user1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");
    };

    it("enables the button when the password and password repeat fields have same value", async () => {
      await setup();
      expect(button).toBeEnabled();
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      await setup();

      await userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
    it("disables button when there is an ongoing api call", async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);
      
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });
    xit("displays spinner while the api request in progress", async () => {
      await setup();

      await userEvent.click(button);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
    it("does not display spinner when there is no api request", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });
    it("displays account activation information after successful sign up request", async () => {
      await setup();

      await userEvent.click(button);

      const text = await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).toBeInTheDocument();
    });
    it("does not display account activation message before sign up request", async () => {
      await setup();
      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).not.toBeInTheDocument();
    });
    it("does not display account activation information after failing sign up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );
      await setup();

      await userEvent.click(button);

      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).not.toBeInTheDocument();
    });
    it("hides sign up form after successful sign up request", async () => {
      await setup();

      const form = screen.getByTestId("form-sign-up");
      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
  });
});